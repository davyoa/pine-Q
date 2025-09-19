<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

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
    <header class="w-full z-20">
      <div class="card-primary flex items-center justify-between h-full p-2">
        <div class="flex flex-row gap-2">
          <img src="/Favicon.ico" alt="App Logo" class="h-8 w-8" />
          <h1>
            <span class="text-2xl font-bold">Pine-Q</span> | 
            <span >{{ props.pageTitle }}</span>
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <slot name="buttons" />
          <div class="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div >
              <h1 class="text-sm font-semibold">David Houde</h1>
              <p class="text-sm">User</p>
            </div>
          </div>
        </div>

      </div>
    </header>

    <!-- Main Page -->
    <main class="grid grid-cols-[auto_1fr] gap-4">
      <AppSidebar v-if="props.showSidebar"/>

      <slot />
    </main>
  </div>
</template>
