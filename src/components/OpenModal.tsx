import { useState } from 'react';
import type { Entity, EntityType, ConditionType, Query } from '../types';
import { addEntityToParent } from '../utils/entityUtils';

interface OpenModalProps {
  setShowOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  query: Query;
  setQuery: React.Dispatch<React.SetStateAction<Query>>;
  clickedID: number;
  currentId: number;
  onIdIncrement: () => void;
}

export function OpenModal({
  setShowOpenModal,
  query,
  setQuery,
  clickedID,
  currentId,
  onIdIncrement,
}: OpenModalProps) {
  const [newEntity, setNewEntity] = useState<Entity>({
    id: currentId + 1,
    type: "GROUP",
    conditionType: "AND",
    title: "",
    items: [],
  });

  const addHandler = (id: number) => {
    if (id === 0) {
      setQuery({
        title: query.title,
        items: [...query.items, newEntity],
      });
    } else {
      setQuery({
        title: query.title,
        items: addEntityToParent(query.items, id, newEntity),
      });
    }
    onIdIncrement();
    setShowOpenModal(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Add Entity</h2>
            <button
              onClick={() => setShowOpenModal(false)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-md transition-colors duration-150"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={newEntity.type}
              onChange={(val) =>
                setNewEntity({
                  ...newEntity,
                  type: val.target.value as EntityType,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-150"
            >
              <option value={"GROUP"}>Group</option>
              <option value={"CONDITION"}>Condition</option>
            </select>
          </div>

          {newEntity.type === "GROUP" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition Type
              </label>
              <select
                value={newEntity.conditionType}
                onChange={(val) =>
                  setNewEntity({
                    ...newEntity,
                    conditionType: val.target.value as ConditionType,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-150"
              >
                <option value={"AND"}>AND</option>
                <option value={"OR"}>OR</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                value={newEntity.title}
                onChange={(val) =>
                  setNewEntity({
                    ...newEntity,
                    title: val.target.value,
                  })
                }
                type="text"
                placeholder="Enter title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-150"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowOpenModal(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                addHandler(clickedID);
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-150"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
