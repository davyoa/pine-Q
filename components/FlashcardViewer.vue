<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-vue-next";

interface Flashcard {
  front: string;
  back: string;
}

interface Props {
  flashcards: Flashcard[];
  title: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const currentIndex = ref(0);
const showBack = ref(false);

const currentCard = computed(() => props.flashcards[currentIndex.value]);
const progress = computed(() => ((currentIndex.value + 1) / props.flashcards.length) * 100);

const nextCard = () => {
  if (currentIndex.value < props.flashcards.length - 1) {
    currentIndex.value++;
    showBack.value = false;
  }
};

const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    showBack.value = false;
  }
};

const toggleCard = () => {
  showBack.value = !showBack.value;
};
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6 p-4 sm:p-6 md:p-10">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h2 class="text-xl sm:text-2xl font-bold break-words">{{ props.title }}</h2>
      <Button variant="outline" class="w-full sm:w-auto" @click="emit('close')">
        Back to Dashboard
      </Button>
    </div>

    <!-- Progress -->
    <div class="space-y-2">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-muted-foreground gap-1">
        <span>Card {{ currentIndex + 1 }} of {{ props.flashcards.length }}</span>
        <span>{{ Math.round(progress) }}% Complete</span>
      </div>
      <Progress :value="progress" class="w-full" />
    </div>

    <!-- Flashcard -->
    <Card class="min-h-[18rem] sm:min-h-[20rem]">
      <CardContent class="p-4 sm:p-6 md:p-8">
        <div class="flex flex-col items-center justify-center min-h-[14rem] text-center space-y-6">
          <div class="w-full">
            <div class="text-base sm:text-lg font-medium mb-2 text-muted-foreground">
              {{ showBack ? "Answer" : "Question" }}
            </div>
            <div class="text-lg sm:text-xl leading-relaxed break-words">
              {{ showBack ? currentCard?.back : currentCard?.front }}
            </div>
          </div>

          <Button
            @click="toggleCard"
            variant="secondary"
            size="lg"
            class="w-full sm:w-auto"
          >
            <template v-if="showBack">
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

    <!-- Navigation -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
      <Button
        variant="outline"
        @click="prevCard"
        :disabled="currentIndex === 0"
        class="w-full sm:w-auto"
      >
        <ChevronLeft class="w-4 h-4 mr-2" />
        Previous
      </Button>

      <div class="text-xs sm:text-sm text-muted-foreground text-center px-2">
        All flashcards are saved on your phone
      </div>

      <Button
        variant="outline"
        @click="nextCard"
        :disabled="currentIndex === props.flashcards.length - 1"
        class="w-full sm:w-auto"
      >
        Next
        <ChevronRight class="w-4 h-4 ml-2" />
      </Button>
    </div>
  </div>
</template>
