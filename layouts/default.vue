<script setup lang="ts">
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

const props = defineProps<{
  pageTitle?: string
  showSidebar?: {
    type: boolean,
    default: true
  }
}>()

</script>

<template>
  <div class="max-h-screen flex gap-2 flex-col m-2">
    <!-- Top Bar -->
    <header class="w-full z-20 flex flex-row gap-3">
      <!-- What's New HoverCard -->
      <div>
        <HoverCard>
          <HoverCardTrigger>
            <div
              class="card-primary flex items-center justify-between p-2 border border-primary/40 bg-primary/5 hover:bg-primary/10 h-full"
            >
              <p class="font-semibold flex flex-row items-center gap-2 whitespace-nowrap">
                🎉 New Interface
              </p>
            </div>
          </HoverCardTrigger>

          <HoverCardContent class="max-w-xs text-sm w-80 space-y-2">
            <div class="text-base font-bold">🎨 Fresh New Interface!</div>
            <p class="leading-snug">
              You can now upload <span class="font-semibold text-primary">PPTX</span> or 
              <span class="font-semibold text-primary">PDF</span> files and instantly 
              turn them into quizzes & flashcards.
            </p>
            <div class="font-semibold text-center text-primary">
              Your study game just leveled up 🚀
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <!-- Main Header Section -->
      <div class="card-primary flex items-center justify-between h-full p-2 w-full">
        <div class="flex flex-row gap-2 items-center">
          <img src="/logo.ico" alt="App Logo" class="h-8 w-8" />
          <h1>
            <span class="text-2xl font-bold">Pine-Q</span> | 
            <span>{{ props.pageTitle }}</span>
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <slot name="buttons" />
        </div>
      </div>
    </header>



    <!-- Main Page -->
    <!-- <main class="grid grid-cols-[auto_1fr] gap-4 mb-6 w-full">
      <AppSidebar v-if="props.showSidebar"/>

      <slot />

    </main> -->

    <main class="mb-6 w-full">
      <slot />
    </main>
  </div>
</template>
