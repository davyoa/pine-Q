<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Home, Layers2, LibraryBig, NotebookText, Users } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: "Home", path: "/home", icon: Home },
  // { name: "Flash Cards", path: "/flashcards", icon: Layers2 },
  // { name: "Study", path: "/study", icon: NotebookText },
  // { name: "Community", path: "/community", icon: Users}
]
</script>

<template>
  <div class="w-20 h-full flex flex-col">
    <aside class="card-primary p-4 w-20 z-50 flex flex-col items-center">
      <nav class="flex flex-col">
        <ul class="space-y-3">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="nav-item group"
              :class="{ 'active': route.path === item.path }"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <div class="tooltip">
                <div class="tooltip-content">{{ item.name }}</div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>


<style scoped>
.nav-item {
  @apply relative flex items-center justify-center w-14 h-14 rounded-full 
         text-muted-foreground hover:text-foreground hover:bg-muted 
         transition-all duration-200;
}

.nav-item.active {
  @apply bg-primary text-primary-foreground;
}

.nav-item:hover .tooltip {
  @apply opacity-100 visible;
}

.tooltip {
  @apply absolute left-full ml-3 opacity-0 invisible transition-all duration-200 pointer-events-none;
}

.tooltip-content {
  @apply bg-popover text-popover-foreground text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-md;
}

.tooltip::before {
  content: '';
  @apply absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 
         border-4 border-transparent border-r-popover;
}
</style>
