"use client";

import { useId } from "react";
import { FileText, ImagePlus, X } from "lucide-react";
import { UPLOAD_LIMITS } from "@/lib/forms/schemas";

/** Downscale photos in the browser so a full set stays under the upload limit. */
export async function compressImage(file: File, maxSide = 1600, quality = 0.8): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/heic" || file.type === "image/heif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function FileUpload({
  label,
  hint,
  accept,
  multiple,
  files,
  onChange,
  error,
}: {
  label: string;
  hint: string;
  accept: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
}) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <p id={`${id}-label`} className="text-sm font-medium">
        {label}
      </p>
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line bg-bg px-4 py-8 text-center transition-colors hover:border-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
      >
        <ImagePlus aria-hidden className="size-6 text-accent" strokeWidth={1.5} />
        <span className="text-[0.9375rem]">Choisir {multiple ? "des fichiers" : "un fichier"}</span>
        <span id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </span>
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint`}
          onChange={async (e) => {
            const picked = Array.from(e.target.files ?? []);
            e.target.value = "";
            const compressed = await Promise.all(picked.map((f) => compressImage(f)));
            onChange(multiple ? [...files, ...compressed].slice(0, UPLOAD_LIMITS.maxFiles) : compressed.slice(0, 1));
          }}
        />
      </label>
      {files.length ? (
        <ul className="grid gap-1.5">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 border border-line bg-paper px-3 py-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <FileText aria-hidden className="size-4 shrink-0 text-muted" />
                <span className="truncate">{f.name}</span>
                <span className="shrink-0 text-muted">{(f.size / 1024 / 1024).toFixed(1)} Mo</span>
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                className="inline-flex size-8 shrink-0 items-center justify-center hover:bg-studio"
                aria-label={`Retirer ${f.name}`}
              >
                <X aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
