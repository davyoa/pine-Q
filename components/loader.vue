<script setup lang="ts">
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="relative flex items-center justify-center">
      <!-- Outer spinning ring -->
      <div
        class="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin"
      ></div>

      <!-- Inner pulsing dot -->
      <div
        class="absolute h-3 w-3 rounded-full bg-primary animate-ping"
      ></div>
    </div>
  </div>
</template>
