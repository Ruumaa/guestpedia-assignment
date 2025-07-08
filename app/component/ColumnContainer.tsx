import { Column, Id, Task } from '@/types/type';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { CSS } from '@dnd-kit/utilities';
import { CiCirclePlus } from 'react-icons/ci';
import TaskCard from './TaskCard';

interface Props {
  col: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  tasks: Task[];
  createTask: (colId: Id) => void;
  deleteTask: (taskId: Id) => void;
  updateTask: (taskId: Id, content: string) => void;
}

const ColumnContainer = (props: Props) => {
  const [editMode, setEditMode] = useState(false);

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  const {
    col,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;

  // const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: col.id,
    data: {
      type: 'Column',
      col,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-black w-80 h-[500px] rounded-md flex flex-col text-white opacity-50 border-2 border-violet-500"
      ></div>
    );

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-black w-80 h-[500px] rounded-md flex flex-col text-white "
    >
      {/* col title */}
      <div
        {...attributes}
        {...listeners}
        onClick={handleEditMode}
        className="bg-slate-800 h-16 cursor-grab rounded-md rounded-b-none p-3 font-bold border-black border-4"
      >
        <div className="flex items-center gap-x-2">
          {editMode ? (
            <input
              value={col.title}
              onChange={(e) => updateColumn(col.id, e.target.value)}
              className="bg-black focus:border-white border rounded outline-none px-2 max-w-[11rem]"
              autoFocus
              onBlur={handleEditMode}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                handleEditMode();
              }}
            />
          ) : (
            <>{col.title}</>
          )}
          <div className="flex items-center justify-center bg-black px-2 py-1 text-sm rounded-full">
            10
          </div>
          <div className="ml-auto">
            <MdDelete
              size={30}
              onClick={() => deleteColumn(col.id)}
              className="text-red-600 hover:text-red-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
      {/* col tasks */}
      <div className="flex grow flex-col overflow-y-auto overflow-x-hidden gap-4 p-2">
        <SortableContext items={tasks}>
          {tasks.map((task) => (
            <TaskCard
              task={task}
              key={task.id}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* col footer */}
      <div className="p-2">
        <button
          onClick={() => createTask(col.id)}
          className="w-full min-h-12 flex items-center justify-center bg-slate-800 font-medium rounded-md gap-x-2 text-sm cursor-pointer"
        >
          <CiCirclePlus size={20} /> <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;
