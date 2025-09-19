<script setup lang="ts">
import { ref } from "vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const step = ref(1);
const inputMethod = ref("upload");
const uploadedContent = ref("");
const uploadedFileName = ref("");
const deckTitle = ref("");
const deckType = ref("flashcard");

const emit = defineEmits<{
  (e: "new-study-deck-info", content: string, title: string, deckType: string): void;
}>();

const handleFileContent = (content: string, fileName: string) => {
  uploadedContent.value = content;
  uploadedFileName.value = fileName;

  // ✅ Auto-fill title from filename (without extension)
  if (fileName) {
    deckTitle.value = fileName.replace(/\.[^/.]+$/, "");
  }
};

const handleNext = () => {
  if (step.value < 2) step.value++;
};

const handleBack = () => {
  if (step.value > 1) step.value--;
};

const handleOnDone = () => {
  emit("new-study-deck-info", uploadedContent.value, deckTitle.value, deckType.value);
};
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <slot />
    </DialogTrigger>

    <DialogContent class="sm:max-w-lg rounded-2xl">
      <DialogHeader>
        <DialogTitle class="text-xl font-semibold">
          Step {{ step }}:
          {{ step === 1 ? "Add Study Material" : "Deck Info" }}
        </DialogTitle>
        <DialogDescription>
          {{ step === 1 
            ? "Upload your notes or paste text to generate quizzes or flashcards instantly."
            : "Give your deck a title and select its type."
          }}
        </DialogDescription>
      </DialogHeader>

      <!-- Step 1: Content First -->
      <div v-if="step === 1" class="space-y-6 mt-4">
        <Tabs v-model="inputMethod" class="w-full" default-value="upload">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="text">Paste Text</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>

          <!-- Paste Text -->
          <TabsContent value="text" class="mt-4">
            <textarea
              v-model="uploadedContent"
              class="w-full min-h-[180px] border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Paste your study material here..."
            ></textarea>
          </TabsContent>

          <!-- Upload -->
          <TabsContent value="upload" class="mt-4">
            <FileUpload @file-content="handleFileContent" />
          </TabsContent>
        </Tabs>
      </div>

      <!-- Step 2: Deck Info -->
      <div v-if="step === 2" class="space-y-4 mt-4">
        <!-- Deck Title -->
        <div class="space-y-2">
          <Label>Deck Title</Label>
          <Input
            v-model="deckTitle"
            type="text"
            placeholder="Enter deck title"
          />
        </div>

        <!-- Deck Type (Shadcn Select) -->
        <div class="space-y-2">
          <Label>Deck Type</Label>
          <Select v-model="deckType">
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="flashcard">Flashcards</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="summary">Summaries</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Footer -->
      <DialogFooter class="mt-6 flex justify-between">
        <Button variant="ghost" @click="handleBack" :disabled="step === 1">
          Back
        </Button>

        <div class="flex gap-2">
          <DialogClose v-if="step === 2" as-child>
            <Button variant="default" @click="handleOnDone" :disabled="!deckTitle">
              Done
            </Button>
          </DialogClose>

          <Button v-else variant="default" @click="handleNext" :disabled="!uploadedContent">
            Next
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
