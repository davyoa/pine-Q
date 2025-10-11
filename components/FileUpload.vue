<script setup lang="ts">
import { ref } from "vue";
import { Upload, File as FileIcon, X, AlertCircle } from "lucide-vue-next";
import { useToast } from "~/lib/useToast";
import { extractPdfText } from "~/lib/pdf";
import { extractPptxText } from "~/lib/powerpoint";

const toast = useToast();

const emit = defineEmits<{
  (e: "file-content", content: string, fileName: string): void;
}>();

const isDragOver = ref(false);
const uploadedFile = ref<File | null>(null);
const isProcessing = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const allowedExtensions = [".txt", ".pdf", ".doc", ".docx", ".pptx", ".ppt"];

const handleFileSelect = async (file: File) => {
  if (!file) return;
  
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    toast.error("Please upload a text file (.txt), PDF (.pdf), Word document (.doc, .docx), or PowerPoint (.ppt, .pptx).");
    return;
  }

  uploadedFile.value = file;
  isProcessing.value = true;

  try {
    let content = "";

    if (file.type === "text/plain" || fileExtension === ".txt") {
      content = await file.text();
    } else if (file.type === "application/pdf" || fileExtension === ".pdf") {
      content = await extractPdfText(file);
    } else if (fileExtension === ".ppt" || fileExtension === ".pptx") {
      content = await extractPptxText(file);
    }


    else if (fileExtension === ".doc" || fileExtension === ".docx") {
      toast.error("Word document support coming soon!");
      uploadedFile.value = null;
      isProcessing.value = false;
      return;
    }  else {
      toast.error("Unsupported file type.");
      uploadedFile.value = null;
      isProcessing.value = false;
      return;
    }

    if (content.trim().length < 1) {
      toast.error("File content is too short. Please provide more material.");
      uploadedFile.value = null;
      isProcessing.value = false;
      return;
    }

    const GROK_LIMIT = 32000;
    const SYSTEM_PROMPT_BUFFER = 1000;
    const MAX_CONTENT_LENGTH = GROK_LIMIT - SYSTEM_PROMPT_BUFFER;
    if (content.length > MAX_CONTENT_LENGTH) {
      content = content.slice(0, MAX_CONTENT_LENGTH);
    }

    emit("file-content", content, file.name);
    toast.success("File uploaded successfully!");
  } catch (error) {
    console.error("Error processing file:", error);
    toast.error("Failed to process file. Please try again.");
    uploadedFile.value = null;
  } finally {
    isProcessing.value = false;
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  if (e.dataTransfer?.files.length) {
    handleFileSelect(e.dataTransfer.files[0]);
  }
};
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = true;
};
const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
};

const handleFileInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    handleFileSelect(target.files[0]);
  }
};

const removeFile = () => {
  uploadedFile.value = null;
  if (fileInputRef.value) fileInputRef.value.value = "";
};
</script>

<template>
  <div class="space-y-4">
    <Card
      class="border-2 border-dashed transition-colors cursor-pointer"
      :class="{
        'border-primary bg-primary/5': isDragOver,
        'border-green-500 bg-green-50': uploadedFile,
        'border-muted-foreground/25 hover:border-primary/50': !uploadedFile && !isDragOver
      }"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @click="!uploadedFile && fileInputRef?.click()"
    >
      <CardContent class="p-8">
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          accept=".txt,.pdf,.doc,.docx,.ppt,.pptx"
          @change="handleFileInputChange"
          :disabled="isProcessing"
        />

        <template v-if="!uploadedFile">
          <div class="text-center space-y-4">
            <div class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload class="w-8 h-8 text-primary" />
            </div>
            <div>
              <p class="text-lg font-medium">
                {{ isDragOver ? "Drop your file here" : "Upload study material" }}
              </p>
              <p class="text-sm text-muted-foreground mt-2">
                Drag and drop or click to select a file
              </p>
              <p class="text-xs text-muted-foreground mt-1">
                Supports: TXT, Word, PowerPoint
              </p>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileIcon class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="font-medium">{{ uploadedFile.name }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ (uploadedFile.size / 1024).toFixed(1) }} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              @click.stop="removeFile"
              :disabled="isProcessing"
            >
              <X class="w-4 h-4" />
            </Button>
          </div>
        </template>

        <div v-if="isProcessing" class="mt-4 text-center">
          <div class="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Processing file...</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="flex items-start space-x-2 text-sm text-muted-foreground">
      <AlertCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div>
        <p><strong>Supported formats:</strong> (pdf, txt and pptx)</p>
      </div>
    </div>
  </div>
</template>
