<script setup lang="ts">
import Toaster from '~/components/ui/toast/Toaster.vue'
import { useHead } from '#imports'

useHead({
  titleTemplate: (title) => title ? `${title} | Pine-Q` : 'Pine-Q',
  meta: [
    { name: 'description', content: 'Transform your study materials to Quizzes And Flashcards' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/logo.png' },
    { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' }
  ]
})
</script>

<template>
  <NuxtLayout>
    <ClientOnly>
      <Toaster />
    </ClientOnly>

    <!-- Render actual pages here -->
    <NuxtPage />
  </NuxtLayout>
</template>
