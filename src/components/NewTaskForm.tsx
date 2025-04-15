'use client';

import { useState } from 'react';
import type { Column } from '@/lib/models/column';

interface NewTaskFormProps {
  columns: Column[];
  onClose: () => void;
  onTaskAdded: () => void;
  isVisible: boolean;
}

export default function NewTaskForm({
  columns,
  onClose,
  onTaskAdded,
  isVisible
}: NewTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState<number | undefined>(
    columns.length > 0 ? columns[0].id : undefined
  );
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { title?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !columnId) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/columns/${columnId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      
      // Notify parent
      onTaskAdded();
      
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-md w-full max-w-md">
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