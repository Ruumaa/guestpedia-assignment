import { Id, TaskType } from '@/types/type';
import { useLocalStorage } from './useLocalTasks';
import { generateId } from '@/lib/utils';

export const useTaskManager = () => {
  const {
    items: tasks,
    create,
    update,
    remove,
    setItems: setTasks,
  } = useLocalStorage<TaskType>('tasks');

  const createTask = (columnId: Id, title: string) => {
    const newTask: TaskType = {
      id: generateId(),
      columnId,
      desc: 'Sample task description',
      title,
      priority: 'medium',
    };
    create(newTask);
  };

  const updateTask = (id: Id, data: Partial<TaskType>) => {
    update(id, data);
  };

  const deleteTask = (id: Id) => {
    remove(id);
  };

  const currLength = () => {
    return tasks.length;
  };

  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    setTasks,
    currLength,
  };
};
