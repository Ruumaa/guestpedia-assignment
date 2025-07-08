'use client';
import { generateId } from '@/lib/utils';
import { Column, Id, Task } from '@/types/type';
import React, { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import ColumnContainer from './ColumnContainer';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import TaskCard from './TaskCard';

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeCol, setActiveCol] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const addNewColumn = () => {
    const newColumn: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns((prev) => [...prev, newColumn]);
  };

  const deleteColumn = (id: Id) => {
    const filteredColums = columns.filter((col) => col.id !== id);
    const newTasks = tasks.filter((t) => t.columnId !== id);

    setColumns(filteredColums);
    setTasks(newTasks);
  };

  //   const columnId = useMemo(() => columns.map((col) => col.id), [columns]);

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === 'Column') {
      return setActiveCol(e.active.data.current.col);
    }
    if (e.active.data.current?.type === 'Task') {
      return setActiveTask(e.active.data.current.task);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveCol(null);
    setActiveTask(null);

    const { active, over } = e;
    if (!over) return;

    const activeColId = active.id;
    const overColId = over.id;

    if (activeColId === overColId) return;

    setColumns((columns) => {
      const activeColIndex = columns.findIndex((col) => col.id === activeColId);
      const overColIndex = columns.findIndex((col) => col.id === overColId);

      //   arrayMove(array, fromIndex, toIndex);
      return arrayMove(columns, activeColIndex, overColIndex);
    });
  };

  const onDragOver = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (!isActiveTask) return;

    // dropping task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
        const overTaskIndex = tasks.findIndex((task) => task.id === overId);

        // revise the column id
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    // dropping task over a column
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);

        // revise the column id
        tasks[activeTaskIndex].columnId = over.id;

        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const updateColumn = (id: Id, title: string) => {
    const newCol = columns.map((col) => {
      // if id isnt same, return as it is
      if (col.id !== id) return col;
      //  if id is same, return with updated title
      return {
        ...col,
        title,
      };
    });
    setColumns(newCol);
  };

  const createTask = (colId: Id) => {
    const newTask: Task = {
      id: generateId(),
      columnId: colId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (taskId: Id) => {
    return setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const updateTask = (taskId: Id, content: string) => {
    const newTask = tasks.map((task) => {
      if (task.id !== taskId) return task;
      return { ...task, content };
    });

    setTasks(newTask);
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columns}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  col={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={addNewColumn}
            className="h-16 w-80 min-w-[350px] cursor-pointer rounded-lg text-slate-300 font-semibold border-slate-800 ring-slate-300 hover:ring-2 hover:text-white bg-black border-2 p-4 transition-all duration-300 ease-in-out flex gap-2 items-center"
          >
            <CiCirclePlus size={25} />
            Add Column
          </button>
        </div>
        {typeof window === 'object' &&
          createPortal(
            <DragOverlay>
              {activeCol && (
                <ColumnContainer
                  col={activeCol}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  tasks={tasks.filter((task) => task.columnId === activeCol.id)}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
