"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Download, Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/theme-toggle";
import { UploadZone, type FileWithPreview } from "@/components/upload-zone";

interface GeneratedImage {
  data: string;
  mediaType: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [extraImages, setExtraImages] = useState<FileWithPreview[]>([]);
  const [inspiration, setInspiration] = useState<FileWithPreview[]>([]);
  const [personImages, setPersonImages] = useState<FileWithPreview[]>([]);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<GeneratedImage[]>([]);

  const allImages = [...extraImages, ...inspiration, ...personImages];

  async function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to describe your thumbnail");
      return;
    }

    setLoading(true);
    setGenerated([]);

    try {
      const images = allImages.map((f) => f.base64);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, images, count }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      if (!data.images || data.images.length === 0) {
        throw new Error("No images were generated. Try a different prompt.");
      }

      setGenerated(data.images);
      toast.success(`Generated ${data.images.length} thumbnail(s)`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function downloadImage(img: GeneratedImage, index: number) {
    const ext = img.mediaType.split("/")[1] || "png";
    const link = document.createElement("a");
    link.href = `data:${img.mediaType};base64,${img.data}`;
    link.download = `thumbnail-${index + 1}.${ext}`;
    link.click();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5" color="currentColor" />
            <h1 className="text-lg font-semibold tracking-tight">
              Thumbnail Gen
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="space-y-8">
          {/* Prompt Input */}
          <div>
            <Textarea
              placeholder="Describe the YouTube thumbnail you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none rounded-xl border-border/50 bg-card text-base placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-foreground/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleGenerate();
                }
              }}
            />
            <p className="mt-1.5 text-xs text-muted-foreground/60">
              Press Ctrl+Enter to generate
            </p>
          </div>

          {/* Upload Zones */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <UploadZone
              label="Extra Images"
              description="Additional context images"
              multiple
              files={extraImages}
              onFilesChange={setExtraImages}
            />
            <UploadZone
              label="Inspiration"
              description="Reference thumbnail style"
              multiple={false}
              files={inspiration}
              onFilesChange={setInspiration}
            />
            <UploadZone
              label="Person"
              description="Person to include"
              multiple
              files={personImages}
              onFilesChange={setPersonImages}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6">
            <div className="flex flex-1 items-center gap-4">
              <span className="whitespace-nowrap text-sm text-muted-foreground">
                Count
              </span>
              <Slider
                min={1}
                max={4}
                step={1}
                value={[count]}
                onValueChange={(v) => setCount(v[0])}
                className="max-w-[180px]"
              />
              <span className="w-6 text-center text-sm font-medium">
                {count}
              </span>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              size="lg"
              className="gap-2 rounded-xl px-8"
            >
              {loading ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    color="currentColor"
                  />
                  Generating...
                </>
              ) : (
                <>
                  Generate
                  <ArrowRight className="h-4 w-4" color="currentColor" />
                </>
              )}
            </Button>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: count }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-video w-full rounded-xl"
                />
              ))}
            </div>
          )}

          {/* Generated Thumbnails */}
          {generated.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Results
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {generated.map((img, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-xl border border-border/30"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:${img.mediaType};base64,${img.data}`}
                      alt={`Generated thumbnail ${i + 1}`}
                      className="aspect-video w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1.5 rounded-lg"
                        onClick={() => downloadImage(img, i)}
                      >
                        <Download className="h-3.5 w-3.5" color="currentColor" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
