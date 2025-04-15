'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Task } from '@/lib/models/task';
import type { Column } from '@/lib/models/column';
import ConfirmDialog from './ConfirmDialog';
import SubtasksList from './SubtasksList';

interface TaskDialogProps {
  task: Task | null;
  columns: Column[];
  onClose: () => void;
  onTaskUpdate: () => void;
  onTaskDelete: () => void;
  isVisible: boolean;
}

export default function TaskDialog({
  task,
  columns,
  onClose,
  onTaskUpdate,
  onTaskDelete,
  isVisible
}: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState<number | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [subtasksCompleted, setSubtasksCompleted] = useState(0);
  const [subtasksTotal, setSubtasksTotal] = useState(0);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setColumnId(task.column_id);
      
      // Reset subtask counts when a new task is loaded
      setSubtasksCompleted(0);
      setSubtasksTotal(0);
      
      // Fetch subtasks immediately
      fetchSubtasks();
    }
  }, [task, updateCounter]);

  // Add a window event listener for subtask updates
  useEffect(() => {
    const handleSubtaskEvent = (event: CustomEvent) => {
      if (task && event.detail.taskId === task.id) {
        setUpdateCounter(prev => prev + 1);
      }
    };

    // Add event listener
    window.addEventListener('subtaskUpdated', handleSubtaskEvent as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('subtaskUpdated', handleSubtaskEvent as EventListener);
    };
  }, [task]);

  const fetchSubtasks = useCallback(() => {
    if (task && task.id) {
      fetch(`/api/tasks/${task.id}/subtasks`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch subtasks');
          return res.json();
        })
        .then(subtasks => {
          const completed = subtasks.filter((s: any) => s.is_completed).length;
          setSubtasksCompleted(completed);
          setSubtasksTotal(subtasks.length);
        })
        .catch(err => console.error('Failed to fetch updated subtasks', err));
    }
  }, [task]);

  const handleSubtaskUpdate = useCallback(() => {
    fetchSubtasks();
    setUpdateCounter(prev => prev + 1);
  }, [fetchSubtasks]);

  const handleSave = async () => {
    if (!task) return;
    
    // Validate
    if (!title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: description || '',
          column_id: columnId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      onTaskUpdate();
      setIsEditing(false);
      setErrors({});
    } catch (err) {
      console.error('Error updating task:', err);
      setErrors({ title: 'Failed to update task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteTask = () => {
    setShowOptions(false);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!task) return;
    
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      onTaskDelete();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  if (!isVisible || !task) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 md:p-4 z-50">
        <div 
          className="bg-card rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling
        >
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              {isEditing ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors({});
                    }}
                    className={`text-base md:text-lg font-bold w-full bg-input rounded-md p-2 ${
                      errors.title ? 'border border-destructive' : ''
                    }`}
                    placeholder="Task Title"
                  />
                  {errors.title && (
                    <p className="text-destructive text-xs mt-1">{errors.title}</p>
                  )}
                </div>
              ) : (
                <h3 className="text-base md:text-lg font-bold">{task.title}</h3>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-2 rounded-full hover:bg-secondary"
                >
                  <svg width="5" height="20" viewBox="0 0 5 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#828FA3"/>
                    <circle cx="2.5" cy="10" r="2.5" fill="#828FA3"/>
                    <circle cx="2.5" cy="17.5" r="2.5" fill="#828FA3"/>
                  </svg>
                </button>
                
                {showOptions && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card shadow-lg rounded-md z-10 overflow-hidden">
                    <button 
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-secondary"
                    >
                      Edit Task
                    </button>
                    <button 
                      onClick={confirmDeleteTask}
                      className="w-full text-left px-4 py-2 text-destructive hover:bg-secondary"
                    >
                      Delete Task
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-20 md:h-24 bg-input rounded-md p-2 mb-4 text-xs md:text-sm"
                placeholder="Add a description"
              />
            ) : (
              <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6">
                {task.description || 'No description'}
              </p>
            )}
            
            {/* Subtasks section - shown in both view and edit modes */}
            <div className="mb-4 md:mb-6 border border-secondary/20 rounded-lg p-3 md:p-4 bg-secondary/5">
              <div className="mb-2 flex justify-between items-center">
                <h4 className="text-xs md:text-sm font-medium">
                  Subtasks
                </h4>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  {subtasksCompleted} of {subtasksTotal} completed
                </span>
              </div>
              <SubtasksList taskId={task.id} onSubtaskUpdate={handleSubtaskUpdate} />
            </div>
            
            {isEditing && (
              <div className="mb-4 md:mb-6">
                <label className="block text-xs md:text-sm font-medium mb-2">Status</label>
                <select
                  value={columnId}
                  onChange={(e) => setColumnId(Number(e.target.value))}
                  className="w-full p-2 rounded-md bg-input text-xs md:text-sm"
                >
                  {columns.map((column) => (
                    <option key={column.id} value={column.id}>{column.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {isEditing ? (
              <div className="flex space-x-2 mt-4 md:mt-6">
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-opacity-80 text-white rounded-full py-2 px-3 md:px-4 text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-secondary hover:bg-opacity-80 text-white rounded-full py-2 px-3 md:px-4 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="bg-secondary hover:bg-opacity-80 text-white rounded-full py-2 px-3 md:px-4 text-sm"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog 
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          setIsDeleteConfirmOpen(false);
          handleDelete();
        }}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </>
  );
} 