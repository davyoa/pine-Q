<script setup lang="ts">
import { format } from "date-fns"
import { BookOpen, HelpCircle, Calendar, Hash, Trash } from "lucide-vue-next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type StudyDeck } from "~/types/appTypes"

// --- Props
const props = defineProps<{
  deck: StudyDeck;
}>()


</script>

<template>
    <Card class="hover:shadow-md transition-shadow">
        <CardHeader class="pb-3">
            <CardTitle class="flex items-start justify-between gap-2">
                <div class="flex items-center space-x-2 min-w-0 flex-1">
                    <component
                        :is="props.deck.type === 'flashcard' ? BookOpen : HelpCircle"
                        class="w-5 h-5 text-primary flex-shrink-0"
                    />
                    <span class="truncate text-sm sm:text-base">{{ props.deck.title }}</span>
                </div>

                <slot name="actions"/>
            </CardTitle>
        </CardHeader>

        <CardContent class="space-y-4">
            <div class="flex flex-wrap items-center justify-between text-xs sm:text-sm text-muted-foreground gap-y-1">
                <div class="flex items-center space-x-1">
                    <Hash class="w-4 h-4" />
                    <span>{{ props.deck.item_count }} items</span>
                </div>
                <div class="flex items-center space-x-1">
                <Calendar class="w-4 h-4" />
                <span>
                    {{
                        props.deck.created_at
                        ? format(new Date(props.deck.created_at), "MMM d")
                        : "No date"
                    }}
                </span>
                </div>
            </div>

            <div class="flex items-center">
                <span class="inline-block px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-primary/10 text-primary">
                {{ props.deck.type === "flashcard" ? "Flashcards" : "Quiz" }}
                </span>
            </div>

            <div>
                <NuxtLink :to="`deckViewer/${props.deck.id}`">
                    <Button class="w-full text-sm sm:text-base" variant="outline" >
                        Study Now
                    </Button>
                </NuxtLink>
            </div>
        </CardContent>
    </Card>
</template>
