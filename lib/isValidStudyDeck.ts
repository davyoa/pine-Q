import type { StudyDeck } from "~/types/appTypes";

const isValidStudyDeck = (deck: any): deck is StudyDeck => {
    return (
      typeof deck === 'object' &&
      typeof deck.id === 'string' &&
      typeof deck.title === 'string' &&
      ['flashcard', 'quiz', 'summary'].includes(deck.type) &&
      typeof deck.item_count === 'number' &&
      typeof deck.created_at === 'string' &&
      Array.isArray(deck.content)
    );
};