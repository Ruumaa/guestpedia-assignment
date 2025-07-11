import { useState } from 'react';
import { TaskType } from '@/types/type';

export const useTaskModal = () => {
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const openModal = (task: TaskType) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  return {
    selectedTask,
    openModal,
    closeModal,
  };
};
