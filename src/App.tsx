import { useRef, useState, type DragEvent } from "react";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type LoadedFile = { file: File; text: string };

function App() {
  const [files, setFiles] = useState<LoadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (list: FileList | null) => {
    if (!list) return;
    // Copy first: the input's FileList is emptied when its value is reset
    const picked = Array.from(list);
    const loaded: LoadedFile[] = [];
    for (const file of picked) {
      try {
        loaded.push({ file, text: await file.text() });
      } catch {
        // Unreadable entries (e.g. a dropped folder) are skipped
      }
    }
    setFiles((prev) => [...prev, ...loaded]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setDragging(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <main
      className="scheme-light bg-(image:--texture-grain) min-h-svh overflow-hidden bg-paper font-mono text-ink"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="mx-auto max-w-2xl px-6 py-14 sm:py-20">
        <p className="text-xs tracking-[0.3em] uppercase">
          true-to-size — no. 01
        </p>

        <h1 className="mt-6 font-serif text-6xl leading-[0.95] sm:text-8xl">
          Drop{" "}
          <span className="inline-block -rotate-2 bg-ink px-3 pb-1 text-card italic">
            your
          </span>
          <br />
          <span className="relative inline-block">
            file
            <svg
              className="absolute -bottom-3 left-0 h-4 w-full text-pop"
              viewBox="0 0 200 20"
              preserveAspectRatio="none"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 12C40 4 70 16 110 8S170 6 197 11M10 17C60 12 120 18 180 14" />
            </svg>
          </span>
        </h1>

        <div className="relative mt-20">
          <div
            className="absolute -top-16 right-2 flex items-end gap-1 text-pop"
            aria-hidden="true"
          >
            <span className="-rotate-6 pb-4 font-hand text-xl">right here</span>
            <svg
              className="size-12"
              viewBox="0 0 60 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 6C30 8 46 22 44 50M34 40L44 51L52 38" />
            </svg>
          </div>

          <div className="absolute -top-5 -left-4 size-40 -rotate-6 bg-pop mix-blend-multiply" />
          <div className="absolute bg-[radial-gradient(var(--color-ink)_28%,transparent_30%)] bg-size-[7px_7px] -right-6 -bottom-6 size-36 rounded-full opacity-70" />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`relative block w-full cursor-pointer drop-shadow-[4px_6px_0_rgba(27,26,23,0.18)] transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pop ${
              dragging ? "scale-[1.02] rotate-0" : "rotate-1"
            }`}
          >
            <span className="absolute -top-3 left-1/2 z-10 h-7 w-28 -translate-x-1/2 -rotate-3 bg-tape/80 mix-blend-multiply" />
            <span className="block bg-(image:--texture-grain) [clip-path:var(--shape-torn)] bg-card px-6 pt-10 pb-12 sm:px-8">
              <span
                className={`block border-2 border-dashed px-6 py-12 transition-colors ${
                  dragging ? "border-pop" : "border-ink/50"
                }`}
              >
                <span className="block font-serif text-3xl italic">
                  {dragging ? "let go!" : "drop file here"}
                </span>
                <span className="mt-3 block text-sm">
                  or{" "}
                  <span className="underline decoration-pop decoration-2 underline-offset-4">
                    browse
                  </span>
                </span>
              </span>
            </span>
          </button>

          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {files.length > 0 && (
          <ul className="mt-16 space-y-3">
            {files.map(({ file, text }, i) => (
              <li
                key={`${file.name}-${file.lastModified}-${i}`}
                className={`flex bg-(image:--texture-grain) items-center gap-4 bg-card px-4 py-2 shadow-[2px_3px_0_rgba(27,26,23,0.15)] ${
                  i % 2 ? "rotate-[0.6deg]" : "-rotate-[0.8deg]"
                }`}
              >
                <span className="font-serif text-xl text-pop italic">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">
                  {file.name}
                </span>
                <span className="text-xs opacity-60">
                  {text.split("\n").length} lines · {formatSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove ${file.name}`}
                  className="cursor-pointer px-1 font-hand text-xl leading-none hover:text-pop focus-visible:outline-2 focus-visible:outline-pop"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default App;
