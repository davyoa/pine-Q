// composables/useLocalDecks.ts
import { ref, onMounted, watch } from "vue";
import type { StudyDeck } from "~/types/appTypes";

const STORAGE_KEY = "decks";

export function useLocalDecks(initialDecks: StudyDeck[] = []) {
  // ✅ Always an array of StudyDeck
  const decks = ref<StudyDeck[]>([...initialDecks]);

  // Load from localStorage (client-side only)
  onMounted(() => {
    if (!process.client) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        decks.value = JSON.parse(stored) as StudyDeck[];
      } else {
        decks.value = [...initialDecks];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDecks));
      }
    } catch (error) {
      console.error("Error loading decks from localStorage:", error);
      decks.value = [...initialDecks];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDecks));
    }
  });

  // Update localStorage whenever decks change
  watch(
    decks,
    (newDecks) => {
      if (!process.client) return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDecks));
      } catch (error) {
        console.error("Error saving decks to localStorage:", error);
      }
    },
    { deep: true }
  );

  const addDeck = (deck: StudyDeck) => {
    decks.value = [...decks.value, deck];
  };

  const deleteDeck = (id: string) => {
    decks.value = decks.value.filter((d) => d.id !== id);
  };

  return { decks, addDeck, deleteDeck };
}
