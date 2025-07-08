'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';

const initialColumns = [
  {
    name: 'todo',
    items: [
      { id: '1', priority: 0, title: 'Company website redesign.' },
      { id: '2', priority: 0, title: 'AI Chat Bot.' },
    ],
  },
  {
    name: 'in-progress',
    items: [{ id: '3', priority: 0, title: 'AI Assistant' }],
  },
  {
    name: 'done',
    items: [{ id: '4', priority: 0, title: 'Design landing page' }],
  },
];

interface ItemType {
  id: string;
  priority: number;
  title: string;
}

interface ColumnType {
  name: string;
  items: ItemType[];
}

const TrelloBoard = () => {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromColumnIndex = columns.findIndex((col) =>
      col.items.some((item) => item.id === activeId)
    );
    const toColumnIndex = columns.findIndex(
      (col) =>
        col.name === overId || col.items.some((item) => item.id === overId)
    );

    if (fromColumnIndex === -1 || toColumnIndex === -1) return;

    const fromColumn = columns[fromColumnIndex];
    const toColumn = columns[toColumnIndex];

    const activeItem = fromColumn.items.find((item) => item.id === activeId);
    if (!activeItem) return;

    const newFromItems = fromColumn.items.filter(
      (item) => item.id !== activeId
    );
    const newToItems = [...toColumn.items];

    const overItemIndex = newToItems.findIndex((item) => item.id === overId);
    const insertAt = overItemIndex >= 0 ? overItemIndex : newToItems.length;

    newToItems.splice(insertAt, 0, activeItem);

    const updatedColumns = [...columns];
    updatedColumns[fromColumnIndex] = {
      ...fromColumn,
      items: newFromItems,
    };
    updatedColumns[toColumnIndex] = {
      ...toColumn,
      items: newToItems,
    };

    setColumns(updatedColumns);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 p-5">
        {columns.map((col) => (
          <Column key={col.name} column={col} />
        ))}
      </div>
    </DndContext>
  );
};

const Column = ({ column }: { column: ColumnType }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.name });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? '#d3f9d8' : '#f4f4f4',
        padding: 10,
        width: 250,
        borderRadius: 8,
        minHeight: 150,
      }}
    >
      <h2 style={{ marginBottom: 10 }}>{column.name.toUpperCase()}</h2>
      <SortableContext
        items={column.items.map((item) => `${column.name}-${item.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {column.items.map((item) => (
          <SortableItem key={`${column.name}-${item.id}`} item={item} />
        ))}
      </SortableContext>
    </div>
  );
};

const SortableItem = ({ item }: { item: ItemType }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: 'white',
    padding: '10px',
    marginBottom: '8px',
    borderRadius: '5px',
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {item.title}
    </div>
  );
};

const Page = () => (
  <div className="min-h-screen">
    <TrelloBoard />
  </div>
);

export default Page;
