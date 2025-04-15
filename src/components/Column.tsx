'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Column as ColumnType } from '@/lib/models/column';
import type { Task } from '@/lib/models/task';
import TaskCard from './TaskCard';
import NewTaskForm from './NewTaskForm';

interface ColumnProps {
  column: ColumnType;
  onTaskClick: (task: Task) => void;
  allColumns: ColumnType[]; // We need all columns for the NewTaskForm
}

export default function Column({ column, onTaskClick, allColumns }: ColumnProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewTaskFormVisible, setIsNewTaskFormVisible] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/columns/${column.id}/tasks`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [column.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, column.id]);

  // Handle new task added
  const handleTaskAdded = () => {
    fetchTasks();
    setIsNewTaskFormVisible(false);
  };
  
  // Function to handle task click
  const handleTaskClick = (task: Task) => {
    onTaskClick(task);
  };

  // Get different colors for each column
  const getColumnColor = () => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
    ];
    
    return colors[column.id % colors.length];
  };

  return (
    <>
      <div className="w-[240px] md:w-[280px] flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getColumnColor()}`}></div>
            <h3 className="text-xs md:text-sm uppercase tracking-widest font-bold text-gray-500 truncate max-w-[150px] md:max-w-[200px]">
              {column.name} ({tasks.length})
            </h3>
          </div>
          <button 
            onClick={() => setIsNewTaskFormVisible(true)}
            className="text-gray-400 hover:text-primary transition-colors"
            title={`Add task to ${column.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading && tasks.length === 0 ? (
            <p className="text-sm text-gray-500">Loading tasks...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : tasks.length === 0 ? (
            <div className="border border-dashed border-gray-600 rounded-md h-32 flex flex-col items-center justify-center p-4">
              <p className="text-xs md:text-sm text-gray-500 mb-2">No tasks</p>
              <button
                onClick={() => setIsNewTaskFormVisible(true)}
                className="text-primary hover:underline text-xs md:text-sm font-medium"
              >
                + Add Task
              </button>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                  onSubtaskUpdate={fetchTasks}
                />
              ))}
              
              {/* Add task button immediately after the tasks */}
              <button
                onClick={() => setIsNewTaskFormVisible(true)}
                className="py-2 px-3 text-xs md:text-sm text-primary hover:text-accent flex items-center rounded-md w-full bg-card shadow-sm border border-dashed border-gray-600 hover:bg-secondary hover:bg-opacity-30 transition-colors"
              >
                <svg className="w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Task Form Modal */}
      <NewTaskForm
        columns={allColumns}
        onClose={() => setIsNewTaskFormVisible(false)}
        onTaskAdded={handleTaskAdded}
        isVisible={isNewTaskFormVisible}
        defaultColumnId={column.id}
      />
    </>
  );
} 