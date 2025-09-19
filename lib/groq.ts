import Groq from 'groq-sdk';
import { useRuntimeConfig } from '#imports';

const runtimeConfig = useRuntimeConfig();

if (!runtimeConfig.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is required');
}

const groq = new Groq({
  apiKey: runtimeConfig.GROQ_API_KEY,
});

export async function generateFlashcards(content: string): Promise<any[]> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
        You are an expert flashcard generator. Your ONLY job is to output a valid JSON array of flashcards.

        ### STRICT INSTRUCTIONS:
        - Respond with **ONLY** a JSON array — no commentary, no extra text, no markdown code fences.
        - Each item in the array must be a JSON object with exactly two keys:
          - "front": string — a question or prompt.
          - "back": string — a detailed but concise explanation or answer.
        - Generate **8 to 15 flashcards**.
        - Cover the most important concepts, definitions, and examples in the provided content.
        - If the content is too short or empty, fallback to a general academic topic (math, history, science).
        - The output **must be valid JSON** that can be parsed by \`JSON.parse\` without errors.
        `
      },
      {
        role: "user",
        content: `Create flashcards from the following material:\n\n${content}`
      }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 2048,
  });

  const response = completion.choices[0]?.message?.content || '';
  
  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Error parsing flashcards JSON:', error);
    throw new Error('Failed to generate valid flashcards');
  }
}

export async function generateQuiz(content: string): Promise<any[]> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are an expert quiz generator. Your ONLY job is to output a valid JSON array of multiple-choice questions.
          ### STRICT INSTRUCTIONS:
          - Respond with **ONLY** a JSON array — no commentary, no extra text, no markdown code fences.
          - Each item in the array must be a JSON object with exactly three keys:
            - "question": string — clear, unambiguous question text.
            - "options": array of exactly 4 strings — plausible but distinct answer choices.
            - "correct": number — index (0-3) of the correct option.
          - Generate **10 to 20 questions**.
          - Ensure exactly one correct answer per question.
          - Avoid questions that require diagrams, code, or charts.
          - If the content is too short or empty, fallback to a general academic topic (math, history, science).
          - The output **must be valid JSON** that can be parsed by \`JSON.parse\` without errors.
        `
      },
      {
        role: "user",
        content: `Create multiple-choice questions from the following material:\n\n${content}`
      }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 2048,
  });

  const response = completion.choices[0]?.message?.content || '';
  
  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Error parsing quiz JSON:', error);
    throw new Error('Failed to generate valid quiz questions');
  }
}
