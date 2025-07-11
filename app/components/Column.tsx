import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PiPlusBold } from 'react-icons/pi';
import { ColumnType, Id, TaskType } from '@/types/type';
import Task from './Task';

interface Props {
  col: ColumnType;
  tasks: TaskType[];
  handleTitleChange: (columnId: Id, value: string) => void;
  handleAddTask: (columnId: Id) => void;
  showInput: Record<Id, boolean>;
  setShowInput: (columnId: Id, show: boolean) => void;
  setSelectedTask: (task: TaskType) => void;
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

  // Filter tasks for this column
  const columnTasks = tasks.filter((task) => task.columnId === col.id);
  const isInputVisible = showInput[col.id];
  const inputValue = newTaskTitles[col.id] || '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask(col.id);
    }
    if (e.key === 'Escape') {
      setShowInput(col.id, false);
    }
  };

  const getColumnColors = (title: string) => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('progress') || lowerTitle.includes('doing')) {
      return { header: 'bg-blue-100', text: 'text-blue-800' };
    }

    if (lowerTitle.includes('done') || lowerTitle.includes('completed')) {
      return {
        header: 'bg-green-100',
        text: 'text-green-800',
      };
    }

    return { header: 'bg-slate-200', text: 'text-slate-800' };
  };

  // Replace your div with this:
  const colors = getColumnColors(col.title);

  return (
    <div ref={setNodeRef} style={style}>
      <div className="bg-accent rounded-2xl w-xs h-fit p-1 py-2 flex flex-col">
        {/* Column Header */}
        <div className="rounded-2xl w-xs h-fit p-1 py-2 flex flex-col">
          <div className="flex items-center gap-x-2 px-5 pt-2 pb-3">
            <span
              className={`text-sm font-medium ${colors.header} ${colors.text} px-2 py-1 rounded-sm`}
            >
              {col.title}
            </span>
            <p className={colors.text}>{columnTasks.length}</p>
          </div>
        </div>

        {/* Tasks Container */}
        <div className="flex grow flex-col gap-2 px-2">
          <SortableContext items={columnTasks.map((task) => task.id)}>
            {columnTasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                length={tasks.length - 1}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </SortableContext>
        </div>

        {/* Add Task Section */}
        <div className="p-2">
          {isInputVisible ? (
            <TaskInput
              value={inputValue}
              onChange={(value) => handleTitleChange(col.id, value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setShowInput(col.id, false)}
              onSubmit={() => handleAddTask(col.id)}
            />
          ) : (
            <AddTaskButton onClick={() => setShowInput(col.id, true)} />
          )}
        </div>
      </div>
    </div>
  );
};

const TaskInput = ({
  value,
  onChange,
  onKeyDown,
  onBlur,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: () => void;
  onSubmit: () => void;
}) => (
  <div className="flex flex-col gap-1 relative">
    <textarea
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className="bg-white p-2.5 h-[100px] min-h-[100px] rounded-md overflow-x-hidden shadow focus:outline-none resize-none border-none"
      placeholder="What needs to be done?"
    />
    <button
      onMouseDown={onSubmit}
      className="absolute right-0 bottom-0 text-xs bg-blue-500 text-white px-3 py-1 mb-2.5 mr-2.5 rounded cursor-pointer font-medium"
    >
      Create
    </button>
  </div>
);

const AddTaskButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-fit h-10 flex items-center pl-2.5 pr-10 font-medium rounded-md gap-x-2 text-sm cursor-pointer mt-auto"
  >
    <PiPlusBold size={15} />
    <span>Create</span>
  </button>
);

export default Column;
