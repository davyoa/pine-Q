// server/api/generate.post.ts
import { defineEventHandler, readBody, createError, getRequestIP } from 'h3';
import { generateFlashcards, generateQuiz } from '~/lib/groq';
import { randomUUID } from 'uncrypto';
import { type StudyDeck} from '~/types/appTypes';

export default defineEventHandler(async (event) => {
  try {
    const { content, type, title, ip: clientIP } = await readBody(event);

    if (!content || !type || !title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      });
    }

    // --- Generate Content ---
    let generatedContent: any[] = [];
    if (type === 'flashcard') {
      generatedContent = await generateFlashcards(content);
      
    } else if (type === 'quiz') {
      generatedContent = await generateQuiz(content);
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid type',
      });
    }

    // console.log(generatedContent)

    const id = randomUUID();
    const created_at = new Date().toISOString();
    const createdDeck = {
      id,
      created_at,
      title,
      type,
      content: generatedContent,
      item_count: Array.isArray(generatedContent) ? generatedContent.length : 0,
    };

    return {
      success: 'qenerated',
      deck: createdDeck as StudyDeck
    };
  } catch (error) {
    console.error('Generation error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate study material',
    });
  }
});
