'use client';

import React, { useState, useEffect, useRef } from 'react';
import Portal from './Portal';

interface ColumnFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  title?: string;
  initialName?: string;
  submitLabel?: string;
}

export default function ColumnFormModal({
  isOpen,
  onClose,
  onSubmit,
  title = 'Add Column',
  initialName = '',
  submitLabel = 'Save',
}: ColumnFormModalProps) {
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Column name is required');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      await onSubmit(name);
      setName('');
      onClose();
    } catch (err) {
      console.error('Failed to submit column:', err);
      setError('Failed to create column. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName(initialName);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Portal rootId="modal-root">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <div 
          className="bg-card rounded-md w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="text-lg font-bold mb-6">{title}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  id="name"
                  ref={inputRef}
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  className="w-full p-2 rounded-md bg-input"
                  disabled={isLoading}
                />
                {error && <p className="text-destructive text-xs mt-1">{error}</p>}
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 bg-secondary hover:bg-opacity-80 text-white rounded-full py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-opacity-80 text-white rounded-full py-2 px-4"
                >
                  {isLoading ? 'Saving...' : submitLabel}
                </button>
              </div>
            </form>
            
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-foreground"
              onClick={handleClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
} 