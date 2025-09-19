<script setup lang="ts">
definePageMeta({
  layout: false,
})

import { ChevronLeft, ChevronRight, Eye, EyeOff, CheckCircle, XCircle } from "lucide-vue-next";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useLocalDecks } from "~/lib/useLocalDecks";
import type { Flashcard, Quiz, StudyDeck } from "~/types/appTypes";

type CurrentCard = Flashcard | Quiz;

const route = useRoute();
const { decks } = useLocalDecks([]);
const deck = ref<StudyDeck | null>(null);

const currentIndex = ref(0);
const showFlashCardBack = ref(false);

// Quiz state
const selected = ref<number | null>(null);
const showResult = ref(false);
const quizFinished = ref(false);
const correctCount = ref(0);

// Load deck from composable
onMounted(() => {
  try {
    const deckId = route.params.deckId as string;
    const foundDeck = decks.value.find((d) => d.id === deckId);
    if (foundDeck) {
      deck.value = foundDeck;
    } else {
      console.error(`No deck found for deckId: ${deckId}`);
      deck.value = null;
    }
  } catch (error) {
    console.error("Error loading deck:", error);
    deck.value = null;
  }
});

// Normalize deck content
const deckForCard = computed<Flashcard[] | Quiz[]>(() => {
  if (!deck.value || !deck.value.content) return [];
  if (deck.value.type === "flashcard") {
    return deck.value.content as Flashcard[];
  } else if (deck.value.type === "quiz") {
    return deck.value.content as Quiz[];
  }
  return [];
});

// Current card (can be Flashcard or Quiz)
const currentCard = computed<CurrentCard | null>(() => {
  return deckForCard.value[currentIndex.value] ?? null;
});

// Derived states for convenience
const currentFlashcard = computed<Flashcard | undefined>(() => {
  return deck.value?.type === "flashcard" ? (currentCard.value as Flashcard) : undefined;
});
const currentQuiz = computed<Quiz | undefined>(() => {
  return deck.value?.type === "quiz" ? (currentCard.value as Quiz) : undefined;
});

const progress = computed(() =>
  deckForCard.value.length ? ((currentIndex.value + 1) / deckForCard.value.length) * 100 : 0
);

const isLast = computed(() => currentIndex.value === deckForCard.value.length - 1);

// Flashcard methods
const toggleFlashCard = () => {
  showFlashCardBack.value = !showFlashCardBack.value;
};

// Quiz methods
const handleSubmit = () => {
  if (selected.value !== null) {
    showResult.value = true;
    if (selected.value === currentQuiz.value?.correct) {
      correctCount.value++;
    }
  }
};

const handleNext = () => {
  if (!isLast.value) {
    currentIndex.value++;
    resetQuizState();
  } else {
    quizFinished.value = true;
  }
};

const optionClasses = (i: number) => {
  if (!showResult.value) return "hover:bg-accent";
  if (i === currentQuiz.value?.correct) return "bg-green-100 border-green-500";
  if (selected.value === i && i !== currentQuiz.value?.correct) return "bg-red-100 border-red-500";
  return "opacity-60";
};

// Navigation (shared)
const nextCard = () => {
  if (currentIndex.value < deckForCard.value.length - 1) {
    currentIndex.value++;
    resetCardState();
  }
};

const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    resetCardState();
  }
};

// Reset states when moving to a new card
function resetCardState() {
  showFlashCardBack.value = false;
  resetQuizState();
}

function resetQuizState() {
  selected.value = null;
  showResult.value = false;
}

// Auto-reset quiz state when deck changes or index changes
watch([deck, currentIndex], resetCardState);
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6 p-4 sm:p-6 md:p-10">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h2 class="text-xl sm:text-2xl font-bold break-words">{{ deck?.title || "Deck Not Found" }}</h2>
      <NuxtLink to="/home">
        <Button variant="outline">Back to Home</Button>
      </NuxtLink>
    </div>

    <!-- Progress -->
    <div v-if="deckForCard.length && !quizFinished" class="space-y-2">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-muted-foreground gap-1">
        <span>Card {{ currentIndex + 1 }} of {{ deckForCard.length }}</span>
        <span>{{ Math.round(progress) }}% Complete</span>
      </div>
      <Progress :value="progress" class="w-full" />
    </div>
    <div v-else-if="!deckForCard.length" class="text-center text-muted-foreground">
      No cards available for this deck.
    </div>

    <!-- Flashcard View -->
    <Card v-if="deck?.type === 'flashcard'" class="min-h-[18rem] sm:min-h-[20rem]">
      <CardContent class="p-4 sm:p-6 md:p-8">
        <div class="flex flex-col items-center justify-center min-h-[14rem] text-center space-y-6">
          <div class="w-full">
            <div class="text-base sm:text-lg font-medium mb-2 text-muted-foreground">
              {{ showFlashCardBack ? "Answer" : "Question" }}
            </div>
            <div class="text-lg sm:text-xl leading-relaxed break-words">
              {{ showFlashCardBack 
                ? currentFlashcard?.back || "No Answer" 
                : currentFlashcard?.front || "No Question" }}
            </div>
          </div>
          <Button @click="toggleFlashCard" variant="secondary" size="lg" class="w-full sm:w-auto">
            <template v-if="showFlashCardBack">
              <EyeOff class="w-5 h-5 mr-2" />
              Show Question
            </template>
            <template v-else>
              <Eye class="w-5 h-5 mr-2" />
              Show Answer
            </template>
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Quiz View -->
    <Card v-else-if="deck?.type === 'quiz' && !quizFinished">
      <CardHeader>
        <CardTitle class="text-base sm:text-lg">{{ currentQuiz?.question }}</CardTitle>
      </CardHeader>

      <CardContent class="space-y-6">
        <RadioGroup
          :key="currentIndex"
          :model-value="selected !== null ? String(selected) : undefined"
          @update:model-value="v => selected = parseInt(v)"
          :disabled="showResult"
        >
          <div
            v-for="(option, i) in currentQuiz?.options"
            :key="i"
            :class="['flex items-center space-x-2 p-3 rounded-lg border transition-colors', optionClasses(i)]"
          >
            <RadioGroupItem :value="String(i)" :id="`q${currentIndex}-option-${i}`" />
            <Label
              :for="`q${currentIndex}-option-${i}`"
              class="flex-1 cursor-pointer text-sm sm:text-base"
            >
              {{ option }}
            </Label>

            <template v-if="showResult">
              <CheckCircle
                v-if="i === currentQuiz?.correct"
                class="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
              />
              <XCircle
                v-else-if="selected === i"
                class="w-4 h-4 sm:w-5 sm:h-5 text-red-600"
              />
            </template>
          </div>
        </RadioGroup>

        <div class="flex flex-col sm:flex-row sm:justify-between gap-3">
          <template v-if="!showResult">
            <Button
              @click="handleSubmit"
              :disabled="selected === null"
              class="w-full sm:w-auto sm:ml-auto"
            >
              Submit Answer
            </Button>
          </template>

          <template v-else>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
              <span class="text-sm font-medium text-center sm:text-left">
                <span v-if="selected === currentQuiz?.correct" class="text-green-600">
                  Correct!
                </span>
                <span v-else class="text-red-600">
                  Incorrect
                </span>
              </span>

              <Button @click="handleNext" class="w-full sm:w-auto">
                {{ isLast ? "Finish Quiz" : "Next Question" }}
              </Button>
            </div>
          </template>
        </div>
      </CardContent>
    </Card>
    <!-- Quiz Results -->
    <Card v-else-if="quizFinished">
      <CardHeader>
        <CardTitle class="text-xl font-bold text-center">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4 text-center">
        <p class="text-lg">
          You answered <span class="font-semibold">{{ correctCount }}</span> out of 
          <span class="font-semibold">{{ deckForCard.length }}</span> questions correctly.
        </p>
        <p class="text-muted-foreground">
          Score: <span class="font-semibold">{{ Math.round((correctCount / deckForCard.length) * 100) }}%</span>
        </p>
        <NuxtLink to="/home">
          <Button class="mt-4">Back to Home</Button>
        </NuxtLink>
      </CardContent>
    </Card>

    <!-- Navigation -->
    <div v-if="deckForCard.length && deck?.type === 'flashcard'" class="flex flex-col sm:flex-row items-center justify-between gap-3">
      <Button variant="outline" @click="prevCard" :disabled="currentIndex === 0">
        <ChevronLeft class="w-4 h-4 mr-2" />
        Previous
      </Button>

      <div class="text-xs sm:text-sm text-muted-foreground text-center px-2">
        All cards are saved on your device
      </div>

      <Button variant="outline" @click="nextCard" :disabled="currentIndex === deckForCard.length - 1">
        Next
        <ChevronRight class="w-4 h-4 ml-2" />
      </Button>
    </div>
  </div>
</template>
