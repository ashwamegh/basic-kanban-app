'use client';

import { useState } from 'react';
import type { Board } from '@/lib/models/board';

interface HeaderProps {
  currentBoard?: Board;
  onAddTask: () => void;
}

export default function Header({ currentBoard, onAddTask }: HeaderProps) {
  const [showBoardActions, setShowBoardActions] = useState(false);

  const handleEditBoard = async () => {
    if (!currentBoard) return;
    
    try {
      const newName = prompt('Enter new board name:', currentBoard.name);
      if (!newName || newName === currentBoard.name) return;
      
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
      alert('Failed to update board. Please try again.');
    } finally {
      setShowBoardActions(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!currentBoard) return;
    
    if (!confirm(`Are you sure you want to delete "${currentBoard.name}" board?`)) {
      return;
    }
    
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
      setShowBoardActions(false);
    }
  };

  return (
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
                    onClick={handleEditBoard}
                    className="w-full text-left px-4 py-2 hover:bg-secondary"
                  >
                    Edit Board
                  </button>
                  <button 
                    onClick={handleDeleteBoard}
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
  );
} 