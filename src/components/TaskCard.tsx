'use client';

import { Task } from '@/lib/models/task';
import { useState, useEffect, useRef } from 'react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onSubtaskUpdate?: () => void;
}

export default function TaskCard({ task, onClick, onSubtaskUpdate }: TaskCardProps) {
  const [completedSubtasks, setCompletedSubtasks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [subtasksCount, setSubtasksCount] = useState(0);
  const [updateCounter, setUpdateCounter] = useState(0);
  
  // Force refresh function
  const refreshData = () => {
    setUpdateCounter(prev => prev + 1);
    if (onSubtaskUpdate) {
      onSubtaskUpdate();
    }
  };

  // Fetch subtasks to get completion count
  useEffect(() => {
    setIsLoading(true);
    
    fetch(`/api/tasks/${task.id}/subtasks`)
      .then(res => res.json())
      .then(subtasks => {
        const completed = subtasks.filter((s: any) => s.is_completed).length;
        setCompletedSubtasks(completed);
        setSubtasksCount(subtasks.length);
      })
      .catch(err => console.error('Failed to fetch subtasks', err))
      .finally(() => setIsLoading(false));
  }, [task.id, updateCounter]);

  // Add a window event listener for subtask updates
  useEffect(() => {
    const handleSubtaskEvent = (event: CustomEvent) => {
      if (event.detail.taskId === task.id) {
        refreshData();
      }
    };

    // Add event listener
    window.addEventListener('subtaskUpdated', handleSubtaskEvent as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('subtaskUpdated', handleSubtaskEvent as EventListener);
    };
  }, [task.id]);

  return (
    <div 
      className="bg-card shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all hover:translate-y-[-2px] w-[280px]"
      onClick={onClick}
    >
      <h4 className="font-bold text-sm mb-3 truncate">{task.title}</h4>
      
      {subtasksCount > 0 && (
        <div className="flex items-center">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden mr-2">
            <div 
              className="h-full bg-primary transition-all"
              style={{ 
                width: `${isLoading ? 0 : (completedSubtasks / subtasksCount) * 100}%`,
                transition: 'width 0.5s ease'
              }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {isLoading ? '...' : `${completedSubtasks}/${subtasksCount}`}
          </span>
        </div>
      )}
    </div>
  );
} 