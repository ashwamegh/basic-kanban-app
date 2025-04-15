'use client';

import { useState } from 'react';
import type { Board } from '@/lib/models/board';
import BoardFormModal from './BoardFormModal';

interface HeaderProps {
  currentBoard?: Board;
  onAddTask: () => void;
  onMenuToggle?: () => void;
  onBoardUpdate?: (updatedBoard: Board) => void;
}

export default function Header({ currentBoard, onAddTask, onMenuToggle, onBoardUpdate }: HeaderProps) {
  const [showBoardActions, setShowBoardActions] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleEditBoard = async (newName: string) => {
    if (!currentBoard) return;
    
    try {
      if (newName === currentBoard.name) {
        setIsEditModalOpen(false);
        return;
      }
      
      const response = await fetch(`/api/boards/${currentBoard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update board');
      }
      
      // Get the updated board data
      const updatedBoard = await response.json();
      
      // Update the board in place if callback provided
      if (onBoardUpdate) {
        onBoardUpdate(updatedBoard);
      } else {
        // Fall back to page reload if no callback provided
        window.location.reload();
      }
      
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating board:', err);
      throw new Error('Failed to update board');
    }
  };

  const handleDeleteBoard = async () => {
    if (!currentBoard) return;
    
    try {
      const response = await fetch(`/api/boards/${currentBoard.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete board');
      }
      
      // Remove this board from localStorage if it's the current saved one
      const savedBoardId = localStorage.getItem('lastBoardId');
      if (savedBoardId && parseInt(savedBoardId) === currentBoard.id) {
        localStorage.removeItem('lastBoardId');
      }
      
      // Redirect to home page after deletion
      window.location.href = '/';
      
    } catch (err) {
      console.error('Error deleting board:', err);
      alert('Failed to delete board. Please try again.');
    } finally {
      setIsDeleteConfirmOpen(false);
      setShowBoardActions(false);
    }
  };

  const openEditModal = () => {
    setShowBoardActions(false);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = () => {
    setShowBoardActions(false);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <>
      <header className="h-20 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu toggle */}
          {onMenuToggle && (
            <button 
              onClick={onMenuToggle}
              className="mr-4 p-2 md:hidden text-gray-400 hover:text-white"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
          <h1 className="text-lg md:text-xl font-bold truncate max-w-[200px] md:max-w-none">
            {currentBoard ? currentBoard.name : 'Select a board'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {currentBoard && (
            <>
              <button
                onClick={onAddTask}
                className="bg-primary hover:bg-opacity-80 text-white rounded-full px-3 py-1.5 md:px-4 md:py-2 font-medium flex items-center"
              >
                <span className="mr-1 text-lg">+</span> 
                <span className="hidden md:inline">Add New Task</span>
                <span className="md:hidden">Add</span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowBoardActions(!showBoardActions)}
                  className="p-2 rounded-full hover:bg-secondary"
                >
                  <svg width="5" height="20" viewBox="0 0 5 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#828FA3"/>
                    <circle cx="2.5" cy="10" r="2.5" fill="#828FA3"/>
                    <circle cx="2.5" cy="17.5" r="2.5" fill="#828FA3"/>
                  </svg>
                </button>
                
                {showBoardActions && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card shadow-lg rounded-md z-10 overflow-hidden">
                    <button 
                      onClick={openEditModal}
                      className="w-full text-left px-4 py-2 hover:bg-secondary"
                    >
                      Edit Board
                    </button>
                    <button 
                      onClick={openDeleteConfirm}
                      className="w-full text-left px-4 py-2 text-destructive hover:bg-secondary"
                    >
                      Delete Board
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Edit board modal */}
      {currentBoard && (
        <BoardFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditBoard}
          title="Edit Board"
          initialValue={currentBoard.name}
          submitLabel="Save Changes"
        />
      )}

      {/* Delete confirmation modal */}
      {isDeleteConfirmOpen && currentBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card rounded-md shadow-xl max-w-md w-full p-6 mx-4">
            <h2 className="text-xl font-bold text-destructive mb-4">Delete this board?</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete the "{currentBoard.name}" board? This action will remove all columns and tasks and cannot be reversed.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteBoard}
                className="flex-1 bg-destructive hover:bg-opacity-80 text-white py-2 rounded-md transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 bg-secondary text-white py-2 rounded-md hover:bg-opacity-80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 