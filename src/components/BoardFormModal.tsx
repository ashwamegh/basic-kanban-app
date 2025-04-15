'use client';

import { useState, useRef, useEffect } from 'react';
import Portal from './Portal';

interface BoardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  title: string;
  initialValue?: string;
  submitLabel: string;
}

export default function BoardFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialValue = '',
  submitLabel
}: BoardFormModalProps) {
  const [boardName, setBoardName] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setBoardName(initialValue);
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, initialValue]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!boardName.trim()) {
      setError('Board name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit(boardName.trim());
    } catch (err) {
      setError('Failed to save board');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Portal rootId="modal-root">
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto"
        onClick={onClose}
      >
        <div 
          className="relative bg-card rounded-md shadow-xl max-w-md w-full p-6 mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-6">{title}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="boardName" className="block text-sm font-medium mb-2">
                Board Name
              </label>
              <input
                ref={inputRef}
                type="text"
                id="boardName"
                value={boardName}
                onChange={(e) => {
                  setBoardName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full p-2 border border-border rounded bg-secondary text-foreground"
                placeholder="Enter board name"
              />
              {error && (
                <p className="mt-2 text-destructive text-sm">{error}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border rounded hover:bg-secondary transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : submitLabel}
              </button>
            </div>
          </form>
          
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-foreground"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </Portal>
  );
} 