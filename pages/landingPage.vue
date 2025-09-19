<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Brain, Layers, FileUp, Sparkles, BarChart } from "lucide-vue-next"

const features = [
  {
    icon: BookOpen,
    title: "Generate Study Material",
    description: "Turn PDFs, notes, and slides into flashcards and quizzes instantly."
  },
  {
    icon: Brain,
    title: "Smart Practice",
    description: "Practice smarter with spaced repetition and AI-generated hints."
  },
  {
    icon: Layers,
    title: "Organize Everything",
    description: "Keep all your decks and quizzes organized in one place."
  }
]

const learnSteps = [
  {
    icon: FileUp,
    title: "Upload Your Material",
    description: "Import PDFs, PowerPoints, or text files. Our AI extracts key points for you."
  },
  {
    icon: Sparkles,
    title: "Generate Flashcards & Quizzes",
    description: "Get a clean set of flashcards and multiple-choice questions instantly."
  },
  {
    icon: BarChart,
    title: "Track Your Progress",
    description: "See what topics you’ve mastered and where you need more practice."
  }
]

definePageMeta({
    layout: false
})
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <header class="border-b bg-background sticky top-0 z-50">
      <div class="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <!-- Logo -->
        <div class="flex items-center gap-2 cursor-pointer">
          <img src="/Favicon.ico" alt="App Logo" class="h-8 w-8" />
          <span class="font-bold text-lg">Pine-Q</span>
        </div>

        <!-- Nav Links -->
        <nav class="hidden md:flex items-center gap-6">
          <a href="#learn-more" class="text-sm text-muted-foreground hover:text-foreground transition">Learn More</a>
          <a href="#features" class="text-sm text-muted-foreground hover:text-foreground transition">Features</a>
          <!-- <a href="#pricing" class="text-sm text-muted-foreground hover:text-foreground transition">Pricing</a> -->
        </nav>

        <!-- Auth Buttons -->
        <div class="flex items-center gap-2">
          <a href="/home">
            <Button variant="outline">Continue To Dashboard</Button>
          </a>
        </div>
      </div>
    </header>


    <!-- Hero Section -->
    <section class="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        Your AI-Powered Study Companion
      </h1>
      <p class="text-muted-foreground text-lg max-w-2xl mb-8">
        Generate flashcards, quizzes, and summaries from your study materials in seconds.
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <Button size="lg">
          Get Started
        </Button>
        <a href="#learn-more">
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </a>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="bg-muted py-16">
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <Card v-for="feature in features" :key="feature.title" class="text-center">
          <CardContent class="p-6 space-y-4">
            <component :is="feature.icon" class="h-8 w-8 text-primary mx-auto" />
            <h3 class="text-xl font-semibold">{{ feature.title }}</h3>
            <p class="text-sm text-muted-foreground">
              {{ feature.description }}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Learn More Section -->
    <section id="learn-more" class="py-20 bg-background border-t">
      <div class="max-w-4xl mx-auto text-center space-y-12 px-6">
        <h2 class="text-3xl font-bold">How It Works</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          We’ve made it easy to go from study material → practice deck → mastery.
          Here’s how you’ll use the app:
        </p>

        <div class="grid gap-8 md:grid-cols-3 text-left">
          <Card v-for="step in learnSteps" :key="step.title">
            <CardContent class="p-6 space-y-4">
              <component :is="step.icon" class="h-8 w-8 text-primary" />
              <h3 class="text-lg font-semibold">{{ step.title }}</h3>
              <p class="text-sm text-muted-foreground">
                {{ step.description }}
              </p>
            </CardContent>
          </Card>
        </div>

        <div class="pt-8">
          <Button size="lg">
            Try It Now
          </Button>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to start learning smarter?</h2>
      <p class="text-muted-foreground mb-8">
        Join now and transform your study sessions.
      </p>
      <Button size="lg">
        Create Your First Deck
      </Button>
    </section>
  </div>
</template>
