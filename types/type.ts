export type Id = string | number;

export type ColumnType = {
  id: Id;
  title: string;
};

export type Priority = 'low' | 'medium' | 'high';

export type TaskType = {
  id: Id;
  columnId: Id;
  desc?: string;
  title: string;
  priority: Priority;
};
