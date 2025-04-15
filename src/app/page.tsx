'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Column from '@/components/Column';
import TaskDialog from '@/components/TaskDialog';
import NewTaskForm from '@/components/NewTaskForm';
import ColumnFormModal from '@/components/ColumnFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
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

  // State for column management
  const [isNewColumnModalVisible, setIsNewColumnModalVisible] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<ColumnType | null>(null);
  const [isDeleteColumnConfirmVisible, setIsDeleteColumnConfirmVisible] = useState(false);
  
  // State for mobile sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Load the last selected board from localStorage when the app first loads
  useEffect(() => {
    const lastBoardId = localStorage.getItem('lastBoardId');
    if (lastBoardId) {
      setCurrentBoardId(parseInt(lastBoardId));
    }
  }, []);

  // Fetch board details when board changes
  useEffect(() => {
    if (!currentBoardId) return;
    
    // Save the current board ID to localStorage whenever it changes
    localStorage.setItem('lastBoardId', currentBoardId.toString());
    
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
    
    fetchColumns();
  }, [currentBoardId]);

  // Fetch columns function
  const fetchColumns = async () => {
    if (!currentBoardId) return;
    
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

  // Handle board change from sidebar
  const handleBoardSelect = (boardId: number) => {
    setCurrentBoardId(boardId);
    localStorage.setItem('lastBoardId', boardId.toString());
  };

  // Handle board update (e.g., after rename)
  const handleBoardUpdate = (updatedBoard: Board) => {
    setCurrentBoard(updatedBoard);
  };

  const handleNoBoards = () => {
    // Clear any existing board from localStorage
    localStorage.removeItem('lastBoardId');
    setCurrentBoardId(null);
    setCurrentBoard(null);
    setColumns([]);
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
    fetchColumns(); // Refresh all data
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
    fetchColumns(); // Refresh all data
    setIsNewTaskFormVisible(false);
  };

  // Handle new column creation
  const handleCreateColumn = async (name: string) => {
    if (!currentBoardId) return;
    
    try {
      const response = await fetch(`/api/boards/${currentBoardId}/columns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create column');
      }
      
      // Refresh columns
      fetchColumns();
    } catch (err) {
      console.error('Error creating column:', err);
      throw new Error('Failed to create column');
    }
  };

  // Handle column deletion
  const handleDeleteColumn = async () => {
    if (!columnToDelete) return;
    
    try {
      const response = await fetch(`/api/columns/${columnToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete column');
      }
      
      // Refresh columns
      fetchColumns();
      // Close the dialog
      setIsDeleteColumnConfirmVisible(false);
      setColumnToDelete(null);
    } catch (err) {
      console.error('Error deleting column:', err);
    }
  };

  // Confirm column deletion
  const confirmDeleteColumn = (column: ColumnType) => {
    setColumnToDelete(column);
    setIsDeleteColumnConfirmVisible(true);
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <main className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay */}
      {isSidebarVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarVisible(false)}
        ></div>
      )}
      
      {/* Sidebar with mobile visibility toggling */}
      <div className={`${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-full z-30 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          currentBoardId={currentBoardId}
          onBoardSelect={handleBoardSelect}
          onNoBoards={handleNoBoards}
          onClose={() => setIsSidebarVisible(false)}
        />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          currentBoard={currentBoard || undefined} 
          onAddTask={handleAddNewTask} 
          onMenuToggle={toggleSidebar}
          onBoardUpdate={handleBoardUpdate}
        />
        
        {isLoadingColumns ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">Loading columns...</p>
          </div>
        ) : columns.length === 0 ? (
          <div className="flex items-center justify-center flex-1 flex-col p-4 text-center">
            <p className="text-gray-500 mb-4">This board is empty. Create a new column to get started.</p>
            <button 
              className="bg-primary hover:bg-opacity-80 text-white rounded-full px-4 py-2"
              onClick={() => setIsNewColumnModalVisible(true)}
            >
              + Add New Column
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto p-4 md:p-6">
            <div className="flex space-x-4 md:space-x-6 h-full">
              {columns.map((column) => (
                <div className="relative group" key={column.id}>
                  <Column 
                    column={column}
                    onTaskClick={handleTaskClick}
                    allColumns={columns}
                  />
                  
                  {/* Column actions */}
                  <div className="absolute top-0 right-2 md:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => confirmDeleteColumn(column)}
                      className="p-1 bg-card rounded-full text-destructive hover:bg-destructive hover:text-white shadow-md transition-colors"
                      title="Delete column"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="min-w-[240px] md:min-w-[280px] flex items-stretch justify-center">
                <button 
                  className="text-gray-500 hover:text-white bg-[#01091b] rounded-md px-4 py-6 md:px-10 md:py-8 text-lg font-bold hover:bg-opacity-80"
                  onClick={() => setIsNewColumnModalVisible(true)}
                >
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

      {/* New column modal */}
      <ColumnFormModal
        isOpen={isNewColumnModalVisible}
        onClose={() => setIsNewColumnModalVisible(false)}
        onSubmit={handleCreateColumn}
        title="Add New Column"
        submitLabel="Create Column"
      />

      {/* Delete column confirmation */}
      {columnToDelete && (
        <ConfirmDialog
          isOpen={isDeleteColumnConfirmVisible}
          onClose={() => {
            setIsDeleteColumnConfirmVisible(false);
            setColumnToDelete(null);
          }}
          onConfirm={handleDeleteColumn}
          title="Delete Column"
          message={`Are you sure you want to delete the "${columnToDelete.name}" column? All tasks in this column will be permanently deleted.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isDestructive={true}
        />
      )}
    </main>
  );
}
