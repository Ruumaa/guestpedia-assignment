import { Priority, TaskType } from '@/types/type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaCheck, FaCheckSquare, FaGripLines } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface Props {
  task: TaskType;
  length: number;
  onClick?: () => void;
}

const Task = (props: Props) => {
  const { task, length, onClick } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'Task', task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const isDone = task.columnId === 3;

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white/40 h-[100px] min-h-[100px] rounded-md border-2 border-indigo-300/40  shadow"
      />
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-2.5 h-[100px] min-h-[100px] flex items-center justify-center rounded-md active:ring-2 active:ring-inset active:ring-blue-300/60 relative overflow-x-hidden shadow"
    >
      <div className="h-[90%] w-full rounded flex flex-col">
        <p
          {...attributes}
          {...listeners}
          className="line-clamp-2 overflow-hidden text-ellipsis whitespace-normal break-words cursor-grab"
        >
          {task.title}
        </p>
        <div
          className="flex items-center justify-between mt-auto cursor-pointer"
          onClick={onClick}
        >
          <span className="flex items-center gap-x-1.5">
            <FaCheckSquare className="text-[#4BAAE6]" /> SM-{length}
          </span>
          <span className="flex items-center gap-x-1">
            {isDone && <FaCheck className="text-green-600 text-sm" />}{' '}
            {handlePriorityIcon(task.priority)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Task;

const handlePriorityIcon = (priority: Priority | undefined) => {
  switch (priority) {
    case 'low':
      return <IoIosArrowDown className="text-blue-400 size-5" />;
    case 'medium':
      return <FaGripLines className="text-yellow-400  size-4" />;
    case 'high':
      return <IoIosArrowUp className="text-red-400 size-5" />;
    default:
      return <FaCheckSquare />;
  }
};
