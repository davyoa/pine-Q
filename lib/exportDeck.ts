// utils/downloadDeck.ts
import type { StudyDeck } from "~/types/appTypes";
import { useToast } from "./useToast";
const toast = useToast();

export function downloadDeck(deck: StudyDeck) {
  try {
    // Convert to JSON
    const data = JSON.stringify(deck, null, 2);

    // Create Blob and Object URL
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a hidden link & trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deck.title.replace(/\s+/g, "_")}.pqdeck`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Deck Exported Successfully, check your downloads for the .pqdeck file')
  } catch (error) {
    console.error("Error downloading deck:", error);
    toast.error('Deck exportion failed')
  }
}
