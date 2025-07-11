'use client';

import { Id, TaskType } from '@/types/type';
import BaseLayout from '../layouts/BaseLayout';
import Task from './Task';
import { useLocalStorage } from '../hooks/useLocalTasks';
import React, { useState } from 'react';
import { columns, generateId } from '@/lib/utils';
import TaskModal from './TaskModal';
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
import Column from './Column';

const Kanban = () => {
  const {
    items: tasks,
    create,
    update,
    remove,
    clear,
    setItems: setTasks,
  } = useLocalStorage<TaskType>('tasks');

  const [newTaskTitles, setNewTaskTitles] = useState<Record<Id, string>>({});
  const [showInput, setShowInput] = useState<Record<Id, boolean>>({});
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

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

  const deleteTask = (id: Id) => {
    remove(id);
  };

  const handleTitleChange = (columnId: Id, value: string) => {
    setNewTaskTitles((prev) => ({ ...prev, [columnId]: value }));
  };

  const handleAddTask = (columnId: Id) => {
    const title = newTaskTitles[columnId]?.trim();
    if (!title) return;

    createTask(columnId, title);
    setNewTaskTitles((prev) => ({ ...prev, [columnId]: '' }));
    setShowInput((prev) => ({ ...prev, [columnId]: false }));
  };

  const updateTaskDetail = (id: Id, data: Partial<TaskType>) => {
    update(id, data);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === 'Task') {
      return setActiveTask(e.active.data.current.task);
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = e;
    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    setTasks((tasks) => {
      const activeTaskIndex = tasks.findIndex(
        (task) => task.id === activeTaskId
      );
      const overTaskIndex = tasks.findIndex((task) => task.id === overTaskId);
      return arrayMove(tasks, activeTaskIndex, overTaskIndex);
    });
  };

  const onDragOver = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === activeTaskId
        );
        const overTaskIndex = tasks.findIndex((task) => task.id === overTaskId);
        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === activeTaskId
        );

        tasks[activeTaskIndex].columnId = over.id;

        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div onClick={clear}>RESET LOCAL</div>
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTaskDetail}
          onDelete={(id) => {
            deleteTask(id);
            setSelectedTask(null);
          }}
        />
      )}

      <BaseLayout>
        {/* kanban board */}
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="min-h-screen flex my-24 justify-center space-x-4">
            {/* col container */}
            <SortableContext items={columns.map((col) => col.id)}>
              {columns.map((col) => (
                <Column
                  key={col.id}
                  col={col}
                  tasks={tasks}
                  handleAddTask={handleAddTask}
                  handleTitleChange={handleTitleChange}
                  showInput={showInput}
                  setSelectedTask={setSelectedTask}
                  newTaskTitles={newTaskTitles}
                  setShowInput={setShowInput}
                />
              ))}
            </SortableContext>
          </div>
          {typeof window === 'object' &&
            createPortal(
              <DragOverlay>
                {activeTask && <Task task={activeTask} length={tasks.length} />}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </BaseLayout>
    </div>
  );
};

export default Kanban;
