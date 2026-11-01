"use client";

import { cn } from "@/lib/cn";
import { CloseIcon, SearchIcon } from "./icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Buscar", className }: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex h-12 items-center gap-3 rounded-full border border-white/10 bg-neutral-800/70 px-4",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-colors focus-within:border-white/30",
        className,
      )}
    >
      <SearchIcon className="size-5 shrink-0 text-white/50" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onChange("")}
        className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/40 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={() => onChange("")}
          className="grid size-6 shrink-0 place-items-center rounded-full bg-white/15 text-white/80 hover:bg-white/25"
        >
          <CloseIcon className="size-3" />
        </button>
      )}
    </div>
  );
}
