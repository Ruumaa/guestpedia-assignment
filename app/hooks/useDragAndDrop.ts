import { TaskType } from '@/types/type';
import {
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';

export const useDragAndDrop = (
  setTasks: (updater: (tasks: TaskType[]) => TaskType[]) => void
) => {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === 'Task') {
      setActiveTask(e.active.data.current.task);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((task) => task.id === active.id);
      const overIndex = tasks.findIndex((task) => task.id === over.id);
      return arrayMove(tasks, activeIndex, overIndex);
    });
  };

  const onDragOver = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((task) => task.id === active.id);

      if (isOverTask) {
        const overIndex = tasks.findIndex((task) => task.id === over.id);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      }

      if (isOverColumn) {
        tasks[activeIndex].columnId = over.id;
        return arrayMove(tasks, activeIndex, activeIndex);
      }

      return tasks;
    });
  };

  return {
    activeTask,
    sensors,
    onDragStart,
    onDragEnd,
    onDragOver,
  };
};
