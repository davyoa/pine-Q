<template>
  <NuxtLayout name="default" :page-title="'Home'" :show-sidebar="true">
    <template #buttons>
      <!-- Add optional header buttons here -->
    </template>

    <div class="flex flex-col gap-6 w-full">
      <!-- Top Actions -->
      <div class="flex flex-wrap justify-between items-center gap-3">
        <div class="flex flex-wrap gap-3 items-center">
          <CreateNewStudyDeck @new-study-deck-info="handleContent">
            <Button>
              <FilePlus /> Create New Study Deck
            </Button>
          </CreateNewStudyDeck>
          <ImportDeck @imported="handleDeckImport" />
        </div>
      </div>

      <Separator />

      <!-- Main Content Area -->
      <div class="flex items-start justify-center w-full">
        <div class="w-full">
          <!-- Loader -->
          <div v-if="loader" class="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader class="animate-spin w-8 h-8 text-primary" />
            <p class="text-sm sm:text-base text-muted-foreground font-medium">
              Creating deck... Please wait
            </p>
          </div>

          <!-- Grid when there are decks -->
          <div v-else-if="localDecks.decks.value.length > 0" class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <StudyDeck v-for="deck in localDecks.decks.value" :deck="deck" :key="deck.id">
              <template #actions>
                <Button variant="ghost"
                        size="sm"
                        @click="localDecks.deleteDeck(deck.id)"
                        title="Delete Deck"
                        class="text-red-500 hover:bg-red-100 hover:text-red-600">
                  <Trash2 />
                </Button>
                <Button variant="ghost"
                        size="sm"
                        @click="downloadDeck(deck)"
                        title="Export deck">
                  <Download />
                </Button>
              </template>
            </StudyDeck>

            <!-- Quick Add Card -->
            <CreateNewStudyDeck @new-study-deck-info="handleContent">
              <Card class="flex flex-col items-center justify-center gap-3 bg-transparent border-dashed hover:cursor-pointer hover:bg-accent/30 transition p-6">
                <Plus class="text-muted-foreground" :size="58" />
                <p class="text-center text-muted-foreground text-sm">
                  Click here to generate a new study material
                </p>
              </Card>
            </CreateNewStudyDeck>
          </div>

          <!-- Empty State when no decks exist -->
          <div v-else class="flex flex-col items-center justify-center w-full py-12 gap-4 text-center">
            <div class="rounded-full p-4 bg-muted">
              <Plus class="text-muted-foreground" :size="40" />
            </div>
            <h2 class="text-lg font-semibold">
              No Study Decks Yet
            </h2>
            <p class="text-muted-foreground max-w-sm">
              Create your first study deck to start generating flashcards and practice questions.
            </p>
            <CreateNewStudyDeck @new-study-deck-info="handleContent">
              <Button>
                <FilePlus /> Create New Deck
              </Button>
            </CreateNewStudyDeck>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useHead } from '#imports'
useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'Welcome to Pine-Q - Your study assistant.' }
  ]
})

import { Download, FilePlus, Plus, Trash2 } from "lucide-vue-next"
import Separator from "~/components/ui/separator/Separator.vue"
import { downloadDeck } from "~/lib/exportDeck";
import { useLocalDecks } from "~/lib/useLocalDecks";
import type { StudyDeck } from "~/types/appTypes";
import { useToast } from "~/lib/useToast";
import { getPublicIP } from '~/lib/getPublicIp';

const toast = useToast();
const loader = ref(false)

definePageMeta({
  layout: false,
})

interface GenerateResponse {
  success: "qenerated" | string
  deck: StudyDeck
}


const localDecks = useLocalDecks([]);

const handleContent = async (StudyContent: string, title: string, deckType: string) => {
  try {
    loader.value = true;
    const ip = await getPublicIP();
    const response = await $fetch<GenerateResponse>('/api/generate', {
      method: 'POST',
      body: { 
        content: StudyContent,
        title,
        type: deckType,
        ip: ip
      },
    });

    if (response.success === "qenerated") {
      localDecks.addDeck(response.deck);
      toast.success('Deck has been Generated Successfully')
    }
  } catch (error) {
    console.error("Failed to generate deck:", error);
    toast.error('Deck generation failed, Check your internet or try again')
  } finally {
    loader.value = false
  }
}

function handleDeckImport(deck: StudyDeck) {
  localDecks.addDeck(deck);
  toast.success('Deck imported successfully') 
}
</script>
