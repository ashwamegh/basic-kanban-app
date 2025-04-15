'use client';

import { useState, useEffect } from 'react';
import type { Column } from '@/lib/models/column';

interface NewTaskFormProps {
  columns: Column[];
  onClose: () => void;
  onTaskAdded: () => void;
  isVisible: boolean;
  defaultColumnId?: number;
}

export default function NewTaskForm({
  columns,
  onClose,
  onTaskAdded,
  isVisible,
  defaultColumnId
}: NewTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<{ title?: string, subtasks?: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Subtasks state
  const [subtasks, setSubtasks] = useState<{ title: string }[]>([]);

  // Set the initial column when the component mounts or when columns/defaultColumnId changes
  useEffect(() => {
    if (defaultColumnId) {
      setColumnId(defaultColumnId);
    } else if (columns.length > 0 && !columnId) {
      setColumnId(columns[0].id);
    }
  }, [columns, defaultColumnId, columnId]);

  // Reset form when visibility changes
  useEffect(() => {
    if (isVisible) {
      setTitle('');
      setDescription('');
      setSubtasks([]);
      setErrors({});
      
      // Set column ID based on default or first column
      if (defaultColumnId) {
        setColumnId(defaultColumnId);
      } else if (columns.length > 0) {
        setColumnId(columns[0].id);
      }
    }
  }, [isVisible, columns, defaultColumnId]);

  const validateForm = (): boolean => {
    const newErrors: { title?: string, subtasks?: string[] } = {};
    
    // Validate title
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    // Validate subtasks
    const subtaskErrors: string[] = [];
    subtasks.forEach((subtask, index) => {
      if (!subtask.title.trim()) {
        subtaskErrors[index] = 'Subtask title is required';
      }
    });
    
    if (subtaskErrors.length > 0) {
      newErrors.subtasks = subtaskErrors;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !columnId) {
      return;
    }
    
    // Filter out any empty subtasks
    const validSubtasks = subtasks.filter(subtask => subtask.title.trim() !== '');
    
    setIsSubmitting(true);
    
    try {
      // First create the task
      const taskResponse = await fetch(`/api/columns/${columnId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });
      
      if (!taskResponse.ok) {
        throw new Error('Failed to create task');
      }
      
      const newTask = await taskResponse.json();
      
      // Then create subtasks if any
      if (validSubtasks.length > 0) {
        const subtaskPromises = validSubtasks.map((subtask, index) => {
          return fetch(`/api/tasks/${newTask.id}/subtasks`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: subtask.title,
              order: index,
            }),
          });
        });
        
        await Promise.all(subtaskPromises);
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setSubtasks([]);
      
      // Notify parent
      onTaskAdded();
      
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { title: '' }]);
  };

  const updateSubtask = (index: number, title: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].title = title;
    setSubtasks(newSubtasks);
    
    // Clear error for this subtask if it exists
    if (errors.subtasks && errors.subtasks[index]) {
      const newSubtaskErrors = [...errors.subtasks];
      newSubtaskErrors[index] = '';
      setErrors({...errors, subtasks: newSubtaskErrors});
    }
  };

  const removeSubtask = (index: number) => {
    const newSubtasks = [...subtasks];
    newSubtasks.splice(index, 1);
    setSubtasks(newSubtasks);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-bold mb-6">Add New Task</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2 rounded-md bg-input text-sm ${
                  errors.title ? 'border border-destructive' : ''
                }`}
                placeholder="e.g. Take coffee break"
              />
              {errors.title && (
                <p className="text-destructive text-xs mt-1">{errors.title}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-24 p-2 rounded-md bg-input text-sm"
                placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
              />
            </div>
            
            {/* Subtasks section */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Subtasks
              </label>
              <div className="space-y-2 mb-3">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center bg-input rounded-md overflow-hidden group">
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) => updateSubtask(index, e.target.value)}
                      className={`flex-1 p-2 bg-transparent text-sm border-none outline-none focus:ring-0 ${
                        errors.subtasks && errors.subtasks[index] ? 'border-b border-destructive' : ''
                      }`}
                      placeholder={`Subtask ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="bg-transparent hover:bg-secondary/30 text-gray-400 hover:text-destructive p-2 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {errors.subtasks && errors.subtasks.some(err => err) && (
                  <p className="text-destructive text-xs mt-1">One or more subtasks are missing a title</p>
                )}
              </div>
              <button
                type="button"
                onClick={addSubtask}
                className="w-full p-2 rounded-md bg-secondary/20 hover:bg-secondary/30 text-sm flex items-center justify-center transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Subtask
              </button>
            </div>
            
            <div className="mb-6">
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                Status
              </label>
              <select
                id="status"
                value={columnId}
                onChange={(e) => setColumnId(Number(e.target.value))}
                className="w-full p-2 rounded-md bg-input text-sm"
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>{column.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-opacity-80 text-white rounded-full py-2 px-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-secondary hover:bg-opacity-80 text-white rounded-full py-2 px-4"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 