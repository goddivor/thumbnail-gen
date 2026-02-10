"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, ImageIcon, Plus } from "lucide-react";

interface UploadZoneProps {
  label: string;
  description: string;
  multiple?: boolean;
  files: FileWithPreview[];
  onFilesChange: (files: FileWithPreview[]) => void;
}

export interface FileWithPreview {
  file: File;
  preview: string;
  base64: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function UploadZone({
  label,
  description,
  multiple = false,
  files,
  onFilesChange,
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = await Promise.all(
        acceptedFiles.map(async (file) => ({
          file,
          preview: URL.createObjectURL(file),
          base64: await fileToBase64(file),
        }))
      );

      if (multiple) {
        onFilesChange([...files, ...newFiles]);
      } else {
        onFilesChange(newFiles.slice(0, 1));
      }
    },
    [files, multiple, onFilesChange]
  );

  const removeFile = (index: number) => {
    const updated = [...files];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    onFilesChange(updated);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="group relative h-20 w-20 overflow-hidden rounded-lg border border-border/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.preview}
                alt="Upload preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                onClick={() => removeFile(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" color="white" />
              </button>
            </div>
          ))}
          {multiple && (
            <div
              {...getRootProps()}
              className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border/50 transition-colors hover:border-foreground/30"
            >
              <input {...getInputProps()} />
              <Plus className="h-4 w-4" color="currentColor" />
            </div>
          )}
        </div>
      )}

      {files.length === 0 && (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 transition-all ${
            isDragActive
              ? "border-foreground/50 bg-foreground/5"
              : "border-border/50 hover:border-foreground/30 hover:bg-foreground/[0.02]"
          }`}
        >
          <input {...getInputProps()} />
          <ImageIcon
            className="mb-2 h-6 w-6 text-muted-foreground/60"
            color="currentColor"
          />
          <p className="text-center text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
