<template>
  <NuxtLayout name="default" :page-title="'Home'" :show-sidebar="true">
    <template #buttons>
      <!-- <Button>Default Layout</Button> -->
    </template>

    <div class="flex flex-row gap-3 max-h-screen">
      <!-- Study Decks List -->
      <div class="w-full h-full">
        <div class="flex flex-row justify-between items-center mb-4">
          <div class="flex flex-row gap-3 items-center">
            <CreateNewStudyDeck @new-study-deck-info="handleContent">
              <Button>
                <FilePlus /> Create New Study Deck
              </Button>
            </CreateNewStudyDeck>
            <ImportDeck @imported="handleDeckImport"></ImportDeck>
          </div>

          <div>
            <!-- <Button variant="outline">
              <Share />
            </Button> -->
          </div>
        </div>

        <Separator class="mb-4" />

        <!--  Responsive grid with proper spacing -->
        <div v-if="!loader" class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StudyDeck v-for="deck in localDecks.decks.value" :deck="deck" :key="deck.id">
            <template #actions>
              <Button variant="ghost" size="sm" @click="localDecks.deleteDeck(deck.id)" title="Delete Deck" class="text-red-500 hover:bg-red-100 hover:text-red-600">
                <Trash2 />
              </Button>
              <Button variant="ghost" size="sm" @click="downloadDeck(deck)" title="Export deck">
                <Download />
              </Button>
            </template>
          </StudyDeck>

          <CreateNewStudyDeck @new-study-deck-info="handleContent">
            <Card class="flex items-center justify-center bg-transparent border-dashed hover:cursor-pointer">
              <div class="flex flex-col items-center">
                <Plus :size="80"/>
                <p class="w-2/3 text-center">Click on this to generate a study material</p>
              </div>
            </Card>
          </CreateNewStudyDeck>
        </div>

        <div v-if="loader" class="flex flex-col items-center justify-center p-6 space-y-4 rounded-2xl border shadow-sm bg-muted">
          <Loader class="animate-spin w-8 h-8 text-primary" />
          <p class="text-sm sm:text-base text-muted-foreground font-medium">
            Creating deck... Please wait
          </p>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Download, FilePlus,  MonitorDown, Plus, PlusCircle, Share, Trash2 } from "lucide-vue-next"
import Separator from "~/components/ui/separator/Separator.vue"
import { downloadDeck } from "~/lib/exportDeck";
import { useLocalDecks } from "~/lib/useLocalDecks";
import type { StudyDeck } from "~/types/appTypes";
import { useToast } from "~/lib/useToast";
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

const handleContent = async (StudyContent: string, title: string, deckType: string)=>{
  try {
    loader.value = true;
    const response = await $fetch<GenerateResponse>('/api/generate', {
      method: 'POST',
      body: { 
        content: StudyContent,
        title,
        type: deckType,
      },
    });

    if (response.success === "qenerated") {
      localDecks.addDeck(response.deck);
      toast.success('Deck has been Generated Successfully')
    }
  } catch (error) {
    console.error("Failed to generate deck:", error);
    toast.error('Deck generation failed, Check you internet or try again')
  } finally{
    loader.value = false
  }

}



function handleDeckImport(deck: StudyDeck) {
  localDecks.addDeck(deck);
  toast.success('Deck imported successfully') 
}
</script>
