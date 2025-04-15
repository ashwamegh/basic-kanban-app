'use client';

import { useRef, useEffect } from 'react';
import Portal from './Portal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the cancel button when the dialog opens for accessibility
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <Portal rootId="modal-root">
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-3 md:p-0"
        onClick={onClose}
      >
        <div 
          className="relative bg-card rounded-md shadow-xl max-w-md w-full p-4 md:p-6 mx-2 md:mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${isDestructive ? 'text-destructive' : ''}`}>
            {title}
          </h2>
          
          <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">
            {message}
          </p>
          
          <div className="flex space-x-3 md:space-x-4">
            <button
              onClick={onConfirm}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                isDestructive 
                  ? 'bg-destructive hover:bg-opacity-80 text-white' 
                  : 'bg-primary hover:bg-opacity-80 text-white'
              }`}
            >
              {confirmLabel}
            </button>
            <button
              ref={cancelButtonRef}
              onClick={onClose}
              className="flex-1 bg-secondary text-white py-2 text-sm rounded-md hover:bg-opacity-80 transition-colors"
            >
              {cancelLabel}
            </button>
          </div>
          
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