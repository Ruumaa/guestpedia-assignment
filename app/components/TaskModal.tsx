import { TaskType, Priority, Id } from '@/types/type';
import { FaTimes, FaTrash } from 'react-icons/fa';
import React, { useState } from 'react';

interface TaskModalProps {
  task: TaskType;
  onClose: () => void;
  onUpdate: (id: Id, updatedTask: Partial<TaskType>) => void;
  onDelete: (id: Id) => void;
}

const TaskModal = ({ task, onClose, onUpdate, onDelete }: TaskModalProps) => {
  // Consolidated editing state
  const [editingField, setEditingField] = useState<'title' | 'desc' | null>(
    null
  );

  // Consolidated form data
  const [formData, setFormData] = useState({
    title: task.title,
    desc: task.desc,
    priority: task.priority as Priority,
  });

  const saveUpdate = (field: keyof TaskType, value: string | Priority) => {
    onUpdate(task.id, { [field]: value });
  };

  const handleFieldBlur = (field: 'title' | 'desc') => {
    saveUpdate(field, formData[field] as string);
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'title' | 'desc') => {
    if (e.key === 'Enter' && (field === 'title' || !e.shiftKey)) {
      e.preventDefault();
      saveUpdate(field, formData[field] as string);
      setEditingField(null);
    }
  };

  const updateFormData = (
    field: keyof typeof formData,
    value: string | Priority
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Task Detail</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700">Title</label>
          {editingField === 'title' ? (
            <input
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              onBlur={() => handleFieldBlur('title')}
              onKeyDown={(e) => handleKeyDown(e, 'title')}
              className="w-full border-b border-blue-300 focus:outline-none focus:border-blue-500 p-1"
              autoFocus
            />
          ) : (
            <p
              onClick={() => setEditingField('title')}
              className="mt-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
            >
              {formData.title || <i className="text-gray-400">No title</i>}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          {editingField === 'desc' ? (
            <textarea
              value={formData.desc}
              onChange={(e) => updateFormData('desc', e.target.value)}
              onBlur={() => handleFieldBlur('desc')}
              onKeyDown={(e) => handleKeyDown(e, 'desc')}
              className="w-full mt-1 border-b border-blue-300 focus:outline-none focus:border-blue-500 p-1 resize-none"
              rows={4}
              autoFocus
            />
          ) : (
            <p
              onClick={() => setEditingField('desc')}
              className="mt-1 whitespace-pre-line cursor-pointer hover:bg-gray-100 p-1 rounded text-sm text-gray-800"
            >
              {formData.desc || (
                <i className="text-gray-400">Add a description...</i>
              )}
            </p>
          )}
        </div>

        {/* Priority */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => {
              const val = e.target.value as Priority;
              updateFormData('priority', val);
              saveUpdate('priority', val);
            }}
            className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              onDelete(task.id);
              onClose();
            }}
            className="text-red-600 hover:text-red-800 flex items-center gap-2"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
