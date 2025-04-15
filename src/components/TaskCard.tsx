'use client';

import { Task } from '@/lib/models/task';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div 
      className="bg-card shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <h4 className="font-bold text-sm mb-2">{task.title}</h4>
      <p className="text-xs text-gray-500">
        {task.subtasks_count > 0 
          ? `${task.subtasks_count} ${task.subtasks_count === 1 ? 'subtask' : 'subtasks'}`
          : 'No subtasks'}
      </p>
    </div>
  );
} 