import JSZip from "jszip";

export async function extractPptxText(file: File): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("extractPptxText can only be used in the browser");
  }

  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  let text = "";

  // ✅ Iterate over slide XML files
  const slideFiles = Object.keys(zip.files).filter((f) =>
    f.startsWith("ppt/slides/slide")
  );

  for (const slideFile of slideFiles) {
    const content = await zip.files[slideFile].async("string");

    // Extract text between <a:t>...</a:t> tags (PowerPoint text nodes)
    const matches = [...content.matchAll(/<a:t>(.*?)<\/a:t>/g)];
    const slideText = matches.map((m) => m[1]).join(" ");

    if (slideText.trim()) {
      text += slideText + "\n";
    }
  }

  return text.trim();
}
