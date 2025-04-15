'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Column from '@/components/Column';
import TaskDialog from '@/components/TaskDialog';
import NewTaskForm from '@/components/NewTaskForm';
import type { Board } from '@/lib/models/board';
import type { Column as ColumnType } from '@/lib/models/column';
import type { Task } from '@/lib/models/task';

export default function Home() {
  // State for the current board
  const [currentBoardId, setCurrentBoardId] = useState<number | null>(null);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  
  // State for columns in the current board
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  
  // State for task dialog
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogVisible, setIsTaskDialogVisible] = useState(false);
  
  // State for new task form
  const [isNewTaskFormVisible, setIsNewTaskFormVisible] = useState(false);

  // Fetch board details when board changes
  useEffect(() => {
    if (!currentBoardId) return;
    
    const fetchBoardDetails = async () => {
      try {
        const response = await fetch(`/api/boards/${currentBoardId}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentBoard(data);
        }
      } catch (err) {
        console.error('Error fetching board details:', err);
      }
    };
    
    fetchBoardDetails();
  }, [currentBoardId]);

  // Fetch columns when board changes
  useEffect(() => {
    if (!currentBoardId) return;
    
    const fetchColumns = async () => {
      setIsLoadingColumns(true);
      
      try {
        const response = await fetch(`/api/boards/${currentBoardId}/columns`);
        if (response.ok) {
          const data = await response.json();
          setColumns(data);
        }
      } catch (err) {
        console.error('Error fetching columns:', err);
      } finally {
        setIsLoadingColumns(false);
      }
    };
    
    fetchColumns();
  }, [currentBoardId]);

  // Handle board change from sidebar
  const handleBoardChange = (boardId: number) => {
    setCurrentBoardId(boardId);
  };

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogVisible(true);
  };

  // Handle task dialog close
  const handleTaskDialogClose = () => {
    setIsTaskDialogVisible(false);
    setSelectedTask(null);
  };

  // Handle task update
  const handleTaskUpdate = () => {
    // Refresh the columns to get the updated tasks
    const refreshColumns = async () => {
      if (!currentBoardId) return;
      
      try {
        const response = await fetch(`/api/boards/${currentBoardId}/columns`);
        if (response.ok) {
          const data = await response.json();
          setColumns(data);
        }
      } catch (err) {
        console.error('Error refreshing columns:', err);
      }
    };
    
    refreshColumns();
    setIsTaskDialogVisible(false);
    setSelectedTask(null);
  };

  // Handle new task button click
  const handleAddNewTask = () => {
    setIsNewTaskFormVisible(true);
  };

  // Handle new task form close
  const handleNewTaskFormClose = () => {
    setIsNewTaskFormVisible(false);
  };

  // Handle new task added
  const handleTaskAdded = () => {
    // Refresh the columns to get the new task
    const refreshColumns = async () => {
      if (!currentBoardId) return;
      
      try {
        const response = await fetch(`/api/boards/${currentBoardId}/columns`);
        if (response.ok) {
          const data = await response.json();
          setColumns(data);
        }
      } catch (err) {
        console.error('Error refreshing columns:', err);
      }
    };
    
    refreshColumns();
    setIsNewTaskFormVisible(false);
  };

  return (
    <main className="flex h-screen overflow-hidden bg-background">
      <Sidebar onBoardChange={handleBoardChange} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          currentBoard={currentBoard || undefined} 
          onAddTask={handleAddNewTask} 
        />
        
        {isLoadingColumns ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">Loading columns...</p>
          </div>
        ) : columns.length === 0 ? (
          <div className="flex items-center justify-center flex-1 flex-col">
            <p className="text-gray-500 mb-4">This board is empty. Create a new column to get started.</p>
            <button className="bg-primary hover:bg-opacity-80 text-white rounded-full px-4 py-2">
              + Add New Column
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto p-6">
            <div className="flex space-x-6 h-full">
              {columns.map((column) => (
                <Column 
                  key={column.id} 
                  column={column}
                  onTaskClick={handleTaskClick}
                />
              ))}
              
              <div className="min-w-[280px] flex items-center justify-center">
                <button className="text-gray-500 hover:text-white bg-secondary rounded-md px-10 py-8 text-lg font-bold hover:bg-opacity-80">
                  + New Column
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Task dialog */}
      <TaskDialog
        task={selectedTask}
        columns={columns}
        onClose={handleTaskDialogClose}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskUpdate}
        isVisible={isTaskDialogVisible}
      />
      
      {/* New task form */}
      <NewTaskForm
        columns={columns}
        onClose={handleNewTaskFormClose}
        onTaskAdded={handleTaskAdded}
        isVisible={isNewTaskFormVisible}
      />
    </main>
  );
}
