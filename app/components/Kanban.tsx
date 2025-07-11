'use client';

import React from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import BaseLayout from '../layouts/BaseLayout';
import Column from './Column';
import Task from './Task';
import TaskModal from './TaskModal';
import { columns } from '@/lib/utils';

import { useTaskManager } from '../hooks/useTaskManager';
import { useTaskInput } from '../hooks/useTaskInput';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useTaskModal } from '../hooks/useTaskModal';

const Kanban = () => {
  const { tasks, createTask, updateTask, deleteTask, setTasks } =
    useTaskManager();

  const {
    newTaskTitles,
    showInput,
    handleTitleChange,
    handleAddTask,
    toggleInput,
  } = useTaskInput();

  const { selectedTask, openModal, closeModal } = useTaskModal();

  const { activeTask, sensors, onDragStart, onDragEnd, onDragOver } =
    useDragAndDrop(setTasks);

  const handleCreateTask = (columnId: string | number) => {
    handleAddTask(columnId, createTask);
  };

  const handleDeleteTask = (id: string | number) => {
    deleteTask(id);
    closeModal();
  };

  return (
    <div className="min-h-screen">
      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={closeModal}
          onUpdate={updateTask}
          onDelete={handleDeleteTask}
        />
      )}

      <BaseLayout>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="min-h-screen flex my-24 justify-center space-x-4">
            <SortableContext items={columns.map((col) => col.id)}>
              {columns.map((col) => (
                <Column
                  key={col.id}
                  col={col}
                  tasks={tasks}
                  handleAddTask={handleCreateTask}
                  handleTitleChange={handleTitleChange}
                  showInput={showInput}
                  setSelectedTask={openModal}
                  newTaskTitles={newTaskTitles}
                  setShowInput={toggleInput}
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
