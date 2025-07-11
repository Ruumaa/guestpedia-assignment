import { ColumnType } from '@/types/type';

export const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

export const columns: ColumnType[] = [
  {
    id: 1,
    title: 'To Do',
  },
  {
    id: 2,
    title: 'In Progress',
  },
  {
    id: 3,
    title: 'Done',
  },
];
