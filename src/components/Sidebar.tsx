'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Board } from '@/lib/models/board';
import BoardFormModal from './BoardFormModal';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  onBoardSelect: (boardId: number) => void;
  onNoBoards?: () => void;
  currentBoardId?: number | null;
  onClose?: () => void;
}

export default function Sidebar({ onBoardSelect, onNoBoards, currentBoardId, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch('/api/boards');
        if (!response.ok) {
          throw new Error('Failed to fetch boards');
        }
        const data = await response.json();
        setBoards(data);
        
        // If there are no boards, call the onNoBoards callback
        if (data.length === 0) {
          if (onNoBoards) {
            onNoBoards();
          }
          return;
        }
        
        // Get the saved boardId from localStorage
        const savedBoardId = localStorage.getItem('lastBoardId');
        
        // If we have boards, set the selectedBoardId
        if (data.length > 0) {
          if (savedBoardId && data.some((board: Board) => board.id === parseInt(savedBoardId))) {
            // Use the saved board ID if it exists and is valid
            const boardId = parseInt(savedBoardId);
            setSelectedBoardId(boardId);
            onBoardSelect(boardId);
          } else if (currentBoardId) {
            // Use the currentBoardId from props if it exists
            setSelectedBoardId(currentBoardId);
          } else if (selectedBoardId === null) {
            // Otherwise use the first board as default
            setSelectedBoardId(data[0].id);
            onBoardSelect(data[0].id);
          }
        }
      } catch (err) {
        setError('Failed to load boards');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoards();
  }, [onBoardSelect, selectedBoardId, currentBoardId, onNoBoards]);

  // Create a new board
  const handleCreateBoard = async (name: string) => {
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create board');
      }

      const newBoard = await response.json();
      setBoards([...boards, newBoard]);
      setSelectedBoardId(newBoard.id);
      onBoardSelect(newBoard.id);
      localStorage.setItem('lastBoardId', newBoard.id.toString());
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating board:', err);
      throw new Error('Failed to create board');
    }
  };

  // Handle board selection
  const handleBoardSelect = (boardId: number) => {
    setSelectedBoardId(boardId);
    onBoardSelect(boardId);
  };

  return (
    <>
      <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-primary w-6 h-6 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <rect x="0.5" y="0.5" width="7" height="7" rx="1.5" fill="#635FC7" stroke="#635FC7"/>
                  <rect x="0.5" y="17.5" width="7" height="7" rx="1.5" fill="#635FC7" stroke="#635FC7"/>
                  <rect x="16.5" y="0.5" width="7" height="7" rx="1.5" fill="#635FC7" stroke="#635FC7"/>
                  <rect opacity="0.5" x="16.5" y="17.5" width="7" height="7" rx="1.5" fill="#635FC7" stroke="#635FC7"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold">kanban</h1>
            </div>
            
            {/* Close button for mobile - only displayed on mobile */}
            {onClose && (
              <button 
                onClick={onClose}
                className="md:hidden p-2 text-gray-400 hover:text-white"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="px-5 py-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 pl-3">
            ALL BOARDS ({boards.length})
          </h2>
          
          {isLoading ? (
            <div className="px-3 py-2">Loading boards...</div>
          ) : error ? (
            <div className="px-3 py-2 text-destructive">{error}</div>
          ) : (
            <nav className="space-y-1">
              {boards.map((board) => (
                <button
                  key={board.id}
                  onClick={() => handleBoardSelect(board.id)}
                  className={`flex items-center w-full px-3 py-2 rounded-r-full transition-colors ${
                    selectedBoardId === board.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-secondary hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4 mr-3" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Z" fill="currentColor" fillOpacity="0.1"/>
                    <path d="M5 8.5h2m2 0h2M8 5.5v6" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span className="font-medium">{board.name}</span>
                </button>
              ))}
              
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center w-full px-3 py-2 text-primary hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4 mr-3" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Z" fill="currentColor" fillOpacity="0.1"/>
                  <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="font-medium">+ Create New Board</span>
              </button>
            </nav>
          )}
        </div>
        
        {/* Add the theme toggle at the bottom */}
        {/* <div className="mt-auto mb-6">
          <ThemeToggle />
        </div> */}
      </div>

      {/* Create board modal */}
      <BoardFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBoard}
        title="Create New Board"
        submitLabel="Create Board"
      />
    </>
  );
} 