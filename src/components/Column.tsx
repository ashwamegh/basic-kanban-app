'use client';

import { useState, useEffect } from 'react';
import type { Column as ColumnType } from '@/lib/models/column';
import type { Task } from '@/lib/models/task';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  onTaskClick: (task: Task) => void;
}

export default function Column({ column, onTaskClick }: ColumnProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
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
    };

    fetchTasks();
  }, [column.id]);

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
    <div className="min-w-[280px] flex flex-col">
      <div className="flex items-center space-x-2 mb-6">
        <div className={`w-3 h-3 rounded-full ${getColumnColor()}`}></div>
        <h3 className="text-sm uppercase tracking-widest font-bold text-gray-500">
          {column.name} ({tasks.length})
        </h3>
      </div>
      
      <div className="space-y-5 flex-1">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : tasks.length === 0 ? (
          <div className="border border-dashed border-gray-600 rounded-md h-32 flex items-center justify-center">
            <p className="text-sm text-gray-500">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))
        )}
      </div>
    </div>
  );
} 