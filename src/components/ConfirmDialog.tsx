'use client';

import { useRef, useEffect } from 'react';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
      <div 
        className="relative bg-card rounded-md shadow-xl max-w-md w-full p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={`text-xl font-bold mb-4 ${isDestructive ? 'text-destructive' : ''}`}>
          {title}
        </h2>
        
        <p className="text-gray-400 mb-6">
          {message}
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-md transition-colors ${
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
            className="flex-1 bg-secondary text-white py-2 rounded-md hover:bg-opacity-80 transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
} 