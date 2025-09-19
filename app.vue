<script lang="ts" setup>
import Toaster from '~/components/ui/toast/Toaster.vue';
</script>

<template>
  <NuxtLayout>
    <ClientOnly>
      <Toaster />
    </ClientOnly>
    <NuxtPage />
  </NuxtLayout>
</template>