'use client';

import { Id, Task } from '@/types/type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';

interface Props {
  task: Task;
  deleteTask: (taskId: Id) => void;
  updateTask: (taskId: Id, content: string) => void;
}

const TaskCard = (props: Props) => {
  const [mouseOver, setMouseOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { task, deleteTask, updateTask } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseOver(false);
  };

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-800 p-2.5 h-[100px] min-h-[100px] flex items-center justify-center rounded-xl  cursor-grab opacity-50 border-2 border-indigo-500"
      />
    );

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="bg-slate-800 p-2.5 h-[100px] min-h-[100px] flex items-center justify-center rounded-xl hover:ring-2 hover:ring-inset hover:ring-indigo-500 relative cursor-grab overflow-x-hidden"
      >
        <textarea
          value={task.content}
          onChange={(e) => updateTask(task.id, e.target.value)}
          className="h-[90%] w-full resize-none border-none rounded bg-transparent
           focus:outline-none"
          autoFocus
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.shiftKey) {
              toggleEditMode();
            }
          }}
          placeholder="Task content here"
        />
        {mouseOver && (
          <button
            onClick={() => deleteTask(task.id)}
            className="hover:text-red-600 absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 hover:bg-black/40 rounded-full p-2"
          >
            <MdDelete size={25} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onClick={toggleEditMode}
      className="bg-slate-800 p-2.5 h-[100px] min-h-[100px] flex items-center justify-center rounded-xl hover:ring-2 hover:ring-inset hover:ring-indigo-500 relative cursor-grab overflow-x-hidden text-ellipsis task"
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="hover:text-red-600 absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 hover:bg-black/40 rounded-full p-2"
        >
          <MdDelete size={25} />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
