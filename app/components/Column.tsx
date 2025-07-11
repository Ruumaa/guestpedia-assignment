import { ColumnType, Id, TaskType } from '@/types/type';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import React from 'react';
import Task from './Task';
import { PiPlusBold } from 'react-icons/pi';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  col: ColumnType;
  tasks: TaskType[];
  handleTitleChange: (columnId: Id, value: string) => void;
  handleAddTask: (columnId: Id) => void;
  showInput: Record<Id, boolean>;
  setShowInput: React.Dispatch<React.SetStateAction<Record<Id, boolean>>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<TaskType | null>>;
  newTaskTitles: Record<Id, string>;
}

const Column = (props: Props) => {
  const {
    col,
    tasks,
    handleAddTask,
    handleTitleChange,
    showInput,
    setShowInput,
    setSelectedTask,
    newTaskTitles,
  } = props;

  const { setNodeRef, transform, transition } = useSortable({
    id: col.id,
    data: { type: 'Column', col },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <div key={col.id} ref={setNodeRef} style={style}>
        <div className="bg-accent rounded-2xl w-xs h-fit p-1 py-2 flex flex-col">
          <div className="flex items-center gap-x-2 px-5 pt-2 pb-3">
            {/* col title */}
            <span className="text-sm font-medium bg-slate-200 px-2 py-1 rounded-sm">
              {col.title}
            </span>
            {/* tasks length */}
            <p>{tasks.filter((task) => task.columnId === col.id).length}</p>
          </div>
          {/* task container */}
          <div className="flex grow flex-col gap-2 px-2">
            {/* task card */}
            <SortableContext
              items={tasks
                .filter((task) => task.columnId === col.id)
                .map((task) => task.id)}
            >
              {tasks
                .filter((task) => task.columnId === col.id)
                .map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    length={tasks.length - 1}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
            </SortableContext>
          </div>
          <div className="p-2">
            {showInput[col.id] ? (
              <div className="flex flex-col gap-1 relative ">
                <textarea
                  autoFocus
                  value={newTaskTitles[col.id] || ''}
                  onChange={(e) => handleTitleChange(col.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTask(col.id);
                    }
                    if (e.key === 'Escape') {
                      setShowInput((prev) => ({
                        ...prev,
                        [col.id]: false,
                      }));
                    }
                  }}
                  onBlur={() =>
                    setShowInput((prev) => ({
                      ...prev,
                      [col.id]: false,
                    }))
                  }
                  className="bg-white p-2.5 h-[100px] min-h-[100px]  rounded-md overflow-x-hidden shadow focus:outline-none resize-none border-none"
                  placeholder="What needs to be done?"
                />
                <button
                  onMouseDown={() => handleAddTask(col.id)}
                  className="absolute right-0 bottom-0 text-xs bg-blue-500 text-white px-3 py-1 mb-2.5 mr-2.5 rounded cursor-pointer font-medium"
                >
                  Create
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  setShowInput((prev) => ({
                    ...prev,
                    [col.id]: true,
                  }))
                }
                className="w-fit h-10 flex items-center pl-2.5 pr-10 font-medium rounded-md gap-x-2 text-sm cursor-pointer mt-auto"
              >
                <PiPlusBold size={15} /> <span>Create</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Column;
