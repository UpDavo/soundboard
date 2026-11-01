"use client";

import { useId, useRef, useState, type ReactNode, type Ref } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ResponsiveGrid } from "@/components/ui";
import { SortableItem } from "./SortableItem";
import { DragPreview } from "./DragPreview";

interface SortableGridProps<T extends { id: string }> {
  items: T[];
  onMove: (activeId: string, overId: string) => void;
  renderItem: (item: T) => ReactNode;
  /** Lo que se ve bajo el cursor mientras arrastras. */
  renderOverlay: (item: T) => ReactNode;
  gridRef?: Ref<HTMLDivElement>;
}

/**
 * Grilla reordenable con drag & drop (dnd-kit).
 * - Mouse: arrastra tras moverte 6px (un click normal sigue funcionando).
 * - Touch: mantén presionado 250ms (el scroll sigue funcionando).
 */
export function SortableGrid<T extends { id: string }>({
  items,
  onMove,
  renderItem,
  renderOverlay,
  gridRef,
}: SortableGridProps<T>) {
  const dndId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const justDropped = useRef(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
  );

  const activeItem = activeId ? items.find((i) => i.id === activeId) : undefined;

  const handleStart = ({ active }: DragStartEvent) => setActiveId(String(active.id));

  const handleEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    // Evita que soltar dispare el click (reproducir) del tile.
    justDropped.current = true;
    setTimeout(() => (justDropped.current = false), 0);
    if (over && active.id !== over.id) onMove(String(active.id), String(over.id));
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleStart}
      onDragEnd={handleEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <ResponsiveGrid ref={gridRef}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} suppressClick={justDropped}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </ResponsiveGrid>
      </SortableContext>

      <DragOverlay>{activeItem ? <DragPreview>{renderOverlay(activeItem)}</DragPreview> : null}</DragOverlay>
    </DndContext>
  );
}
