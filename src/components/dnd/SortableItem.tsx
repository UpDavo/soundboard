"use client";

import type { ReactNode, RefObject } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/cn";

interface SortableItemProps {
  id: string;
  children: ReactNode;
  /** Si es true, se ignora el click (acaba de terminar un drag). */
  suppressClick?: RefObject<boolean>;
}

export function SortableItem({ id, children, suppressClick }: SortableItemProps) {
  const { setNodeRef, listeners, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      onClickCapture={(e) => {
        if (suppressClick?.current) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "select-none [-webkit-touch-callout:none]",
        isDragging && "opacity-30",
      )}
    >
      {children}
    </div>
  );
}
