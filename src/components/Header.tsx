'use client';

import { useState } from 'react';
import type { Board } from '@/lib/models/board';
import BoardFormModal from './BoardFormModal';

interface HeaderProps {
  currentBoard?: Board;
  onAddTask: () => void;
}

export default function Header({ currentBoard, onAddTask }: HeaderProps) {
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
      
      // Refresh the page to see the updated board
      window.location.reload();
      
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
      <header className="h-20 bg-card border-b border-border px-6 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            {currentBoard ? currentBoard.name : 'Select a board'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentBoard && (
            <>
              <button
                onClick={onAddTask}
                className="bg-primary hover:bg-opacity-80 text-white rounded-full px-4 py-2 font-medium flex items-center"
              >
                <span className="mr-1 text-lg">+</span> Add New Task
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