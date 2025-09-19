<!-- components/ImportDeck.vue -->
<script setup lang="ts">
import { MonitorDown } from "lucide-vue-next";
import { ref } from "vue";
import type { StudyDeck } from "~/types/appTypes";

const emit = defineEmits<{
  (e: "imported", deck: StudyDeck): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

function triggerFilePicker() {
  fileInput.value?.click();
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;

  const file = target.files[0];

  if (!file.name.endsWith(".pqdeck")) {
    alert("Invalid file type. Please select a .pqdeck file.");
    return;
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text) as StudyDeck;
    emit("imported", parsed);
  } catch (error) {
    console.error("Failed to import deck:", error);
    alert("Could not read this file. It may be corrupted.");
  } finally {
    // reset input so user can re-import same file
    target.value = "";
  }
}
</script>

<template>
  <div>
    <input
      type="file"
      ref="fileInput"
      accept=".pqdeck,application/json"
      class="hidden"
      @change="handleFileChange"
    />
    <Button variant="outline" @click="triggerFilePicker">
      <MonitorDown /> Import Deck
    </Button>
  </div>
</template>
