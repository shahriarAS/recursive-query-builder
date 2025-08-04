import { useState, useCallback, useEffect } from 'react';
import type { Entity, EntityType, ConditionType, Query } from '../types';
import { addEntityToParent } from '../utils/entityUtils';

interface OpenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQueryChange: React.Dispatch<React.SetStateAction<Query>>;
  parentId: number;
  nextEntityId: number;
  onEntityCreated: () => void;
}

const INITIAL_ENTITY_STATE: Omit<Entity, 'id'> = {
  type: "GROUP",
  conditionType: "AND",
  title: "",
  items: [],
} as const;

export function OpenModal({
  isOpen,
  onClose,
  onQueryChange,
  parentId,
  nextEntityId,
  onEntityCreated,
}: OpenModalProps) {
  const [newEntity, setNewEntity] = useState<Entity>({
    ...INITIAL_ENTITY_STATE,
    id: nextEntityId,
  });

  useEffect(() => {
    if (isOpen) {
      setNewEntity({
        ...INITIAL_ENTITY_STATE,
        id: nextEntityId,
      });
    }
  }, [isOpen, nextEntityId]);

  const handleTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value as EntityType;
    setNewEntity(prev => ({
      ...prev,
      type: newType,
      conditionType: newType === "GROUP" ? "AND" : undefined,
      title: newType === "CONDITION" ? prev.title : "",
    }));
  }, []);

  const handleConditionTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewEntity(prev => ({
      ...prev,
      conditionType: event.target.value as ConditionType,
    }));
  }, []);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntity(prev => ({
      ...prev,
      title: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    
    if (newEntity.type === "CONDITION" && !newEntity.title.trim()) {
      return;
    }

    if (parentId === 0) {
      onQueryChange(prevQuery => ({
        ...prevQuery,
        items: [...prevQuery.items, newEntity],
      }));
    } else {
      onQueryChange(prevQuery => ({
        ...prevQuery,
        items: addEntityToParent(prevQuery.items, parentId, newEntity),
      }));
    }

    onEntityCreated();
    onClose();
  }, [newEntity, parentId, onQueryChange, onEntityCreated, onClose]);

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const isFormValid = newEntity.type === "GROUP" || 
    (newEntity.type === "CONDITION" && newEntity.title.trim().length > 0);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-lg font-medium text-gray-900">
              Add Entity
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-md transition-colors duration-150"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label 
              htmlFor="entity-type" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Type
            </label>
            <select
              id="entity-type"
              value={newEntity.type}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
              required
            >
              <option value="GROUP">Group</option>
              <option value="CONDITION">Condition</option>
            </select>
          </div>

          {newEntity.type === "GROUP" ? (
            <div>
              <label 
                htmlFor="condition-type" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Condition Type
              </label>
              <select
                id="condition-type"
                value={newEntity.conditionType || "AND"}
                onChange={handleConditionTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                required
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </div>
          ) : (
            <div>
              <label 
                htmlFor="entity-title" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                id="entity-title"
                type="text"
                value={newEntity.title}
                onChange={handleTitleChange}
                placeholder="Enter title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                required
                maxLength={100}
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
            >
              Add Entity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
