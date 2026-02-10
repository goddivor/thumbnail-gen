import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 120;

const THUMBNAIL_SUFFIX =
  "Create a YouTube thumbnail in 16:9 ratio, photorealistic, high quality, vibrant colors";

export async function POST(req: Request) {
  try {
    const { prompt, images, count = 1 } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A prompt is required" },
        { status: 400 }
      );
    }

    const fullPrompt = `${prompt.trim()}. ${THUMBNAIL_SUFFIX}`;

    const imageContents = (images ?? []).map((img: string) => ({
      type: "image" as const,
      image: img,
    }));

    const allGeneratedImages: { data: string; mediaType: string }[] = [];

    const promises = Array.from({ length: count }, async () => {
      const result = await generateText({
        model: google("gemini-3-pro-image-preview"),
        providerOptions: {
          google: { responseModalities: ["TEXT", "IMAGE"] },
        },
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: fullPrompt }, ...imageContents],
          },
        ],
      });

      for (const file of result.files ?? []) {
        if (file.mediaType.startsWith("image/")) {
          allGeneratedImages.push({
            data: file.base64,
            mediaType: file.mediaType,
          });
        }
      }
    });

    await Promise.all(promises);

    return NextResponse.json({ images: allGeneratedImages });
  } catch (error) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
