'use client';

import { useState, useEffect } from 'react';
import type { Subtask } from '@/lib/models/subtask';

interface SubtasksListProps {
  taskId: number;
  onSubtaskUpdate?: () => void;
}

export default function SubtasksList({ taskId, onSubtaskUpdate }: SubtasksListProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isAddingNewSubtask, setIsAddingNewSubtask] = useState(false);

  // Fetch subtasks
  const fetchSubtasks = async () => {
    if (!taskId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/tasks/${taskId}/subtasks`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subtasks');
      }
      
      const data = await response.json();
      setSubtasks(data);
    } catch (err) {
      console.error('Error fetching subtasks:', err);
      setError('Failed to load subtasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubtasks();
  }, [taskId]);

  // Notify parent component about updates
  const notifyUpdate = () => {
    // Call the callback if provided
    if (onSubtaskUpdate) {
      onSubtaskUpdate();
    }
    
    // Dispatch a custom event for other components to listen to
    const event = new CustomEvent('subtaskUpdated', { 
      detail: { 
        taskId,
        timestamp: new Date().getTime()
      } 
    });
    
    window.dispatchEvent(event);
  };

  // Toggle subtask completion
  const handleToggleSubtask = async (subtaskId: number) => {
    try {
      // Optimistic UI update
      setSubtasks(prevSubtasks =>
        prevSubtasks.map(subtask =>
          subtask.id === subtaskId
            ? { ...subtask, is_completed: !subtask.is_completed }
            : subtask
        )
      );
      
      // Notify parent immediately for responsiveness
      notifyUpdate();
      
      const response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subtask');
      }
      
      // No need to update state again as we already did it optimistically
    } catch (err) {
      console.error('Error updating subtask:', err);
      setError('Failed to update subtask');
      
      // Revert the optimistic update if the request failed
      fetchSubtasks();
    }
  };

  // Add new subtask
  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSubtaskTitle.trim()) {
      return;
    }
    
    setIsAddingSubtask(true);
    
    try {
      const response = await fetch(`/api/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newSubtaskTitle,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create subtask');
      }
      
      const newSubtask = await response.json();
      
      // Update local state
      setSubtasks(prevSubtasks => [...prevSubtasks, newSubtask]);
      setNewSubtaskTitle('');
      
      // Notify parent
      notifyUpdate();
    } catch (err) {
      console.error('Error creating subtask:', err);
      setError('Failed to create subtask');
    } finally {
      setIsAddingSubtask(false);
      setIsAddingNewSubtask(false);
    }
  };

  // Delete subtask
  const handleDeleteSubtask = async (subtaskId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking the checkbox
    
    try {
      // Optimistic UI update
      const deletedSubtask = subtasks.find(s => s.id === subtaskId);
      setSubtasks(prevSubtasks => prevSubtasks.filter(subtask => subtask.id !== subtaskId));
      
      // Notify parent immediately
      notifyUpdate();
      
      const response = await fetch(`/api/subtasks/${subtaskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete subtask');
      }
      
      // Already updated state optimistically
    } catch (err) {
      console.error('Error deleting subtask:', err);
      setError('Failed to delete subtask');
      
      // Revert the optimistic update
      fetchSubtasks();
    }
  };

  return (
    <div>      
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-pulse w-6 h-6 rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <p className="text-destructive text-sm p-2 bg-destructive/10 rounded-md">{error}</p>
      ) : (
        <>
          {subtasks.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {subtasks.map(subtask => (
                <li key={subtask.id} className="group relative">
                  <label className="flex items-center w-full py-2 px-3 bg-input rounded-md cursor-pointer hover:bg-secondary/20 transition-colors">
                    <div className="flex-shrink-0 w-5 h-5 mr-3 relative">
                      <input
                        type="checkbox"
                        checked={subtask.is_completed}
                        onChange={() => handleToggleSubtask(subtask.id)}
                        className="absolute opacity-0 w-full h-full cursor-pointer"
                      />
                      <div className={`w-5 h-5 border-2 rounded ${subtask.is_completed ? 'bg-primary border-primary' : 'border-gray-400'} flex items-center justify-center`}>
                        {subtask.is_completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm ${subtask.is_completed ? 'line-through text-gray-400' : ''}`}>
                      {subtask.title}
                    </span>
                  </label>
                  <button
                    onClick={(e) => handleDeleteSubtask(subtask.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-secondary/40 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 mb-4 italic">No subtasks yet. Add one below.</p>
          )}
          
          {isAddingNewSubtask ? (
            <form onSubmit={handleAddSubtask} className="mt-2">
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Subtask title"
                  className="p-2 rounded-md bg-input text-sm w-full"
                  disabled={isAddingSubtask}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={isAddingSubtask || !newSubtaskTitle.trim()}
                    className="flex-1 bg-primary hover:bg-opacity-80 text-white rounded-md p-2 text-sm disabled:opacity-50 transition-colors"
                  >
                    {isAddingSubtask ? 'Adding...' : 'Add Subtask'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewSubtask(false)}
                    className="flex-1 bg-secondary hover:bg-opacity-80 text-white rounded-md p-2 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingNewSubtask(true)}
              className="flex items-center justify-center w-full p-2 rounded-md bg-secondary/20 hover:bg-secondary/30 text-sm transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Subtask
            </button>
          )}
        </>
      )}
    </div>
  );
} 