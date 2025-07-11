import { useState } from 'react';
import { Id } from '@/types/type';

export const useTaskInput = () => {
  const [newTaskTitles, setNewTaskTitles] = useState<Record<Id, string>>({});
  const [showInput, setShowInput] = useState<Record<Id, boolean>>({});

  const handleTitleChange = (columnId: Id, value: string) => {
    setNewTaskTitles((prev) => ({ ...prev, [columnId]: value }));
  };

  const handleAddTask = (
    columnId: Id,
    onCreateTask: (columnId: Id, title: string) => void
  ) => {
    const title = newTaskTitles[columnId]?.trim();
    if (!title) return;

    onCreateTask(columnId, title);
    setNewTaskTitles((prev) => ({ ...prev, [columnId]: '' }));
    setShowInput((prev) => ({ ...prev, [columnId]: false }));
  };

  const toggleInput = (columnId: Id, show: boolean) => {
    setShowInput((prev) => ({ ...prev, [columnId]: show }));
  };

  return {
    newTaskTitles,
    showInput,
    handleTitleChange,
    handleAddTask,
    toggleInput,
  };
};
