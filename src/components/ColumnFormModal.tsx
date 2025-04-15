'use client';

import React, { useState } from 'react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-md w-full max-w-md">
        <div className="p-6">
          <h2 className="text-lg font-bold mb-6">{title}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="w-full p-2 rounded-md bg-input"
                autoFocus
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
        </div>
      </div>
    </div>
  );
} 