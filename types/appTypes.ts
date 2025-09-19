export interface Flashcard {
  front: string;
  back: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
}

export interface StudyDeck {
  id: string;
  title: string;
  type: 'flashcard' | 'quiz' | 'summary';
  item_count: number;
  created_at: string;
  content: Flashcard[] | Quiz[];
}

