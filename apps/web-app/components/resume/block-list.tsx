"use client"

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"

import { BlockCard } from "@/components/resume/block-card"
import { useResumeDispatch, useResumeState } from "@/lib/resume/context"
import { Button } from "@workspace/ui/components/button"

export function BlockList() {
  const { blocks } = useResumeState()
  const dispatch = useResumeDispatch()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      dispatch({ type: "REORDER_BLOCKS", activeId: String(active.id), overId: String(over.id) })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <BlockCard key={block.id} block={block} />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1 self-start"
        onClick={() => dispatch({ type: "ADD_BLOCK" })}
        data-no-print
      >
        <Plus className="size-4" />
        Add section
      </Button>
    </div>
  )
}
