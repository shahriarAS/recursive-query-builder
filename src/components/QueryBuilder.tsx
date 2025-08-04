import { useCallback } from 'react';
import type { Query } from '../types';
import { EntityItem } from './EntityItem';

interface QueryBuilderProps {
  query: Query;
  onQueryChange: React.Dispatch<React.SetStateAction<Query>>;
  onRemoveEntity: (id: number) => void;
  onAddEntity: (id: number) => void;
  onAddClick: () => void;
}

export function QueryBuilder({
  query,
  onQueryChange,
  onRemoveEntity,
  onAddEntity,
  onAddClick,
}: QueryBuilderProps) {
  const handleAddClick = useCallback(() => {
    onAddClick();
  }, [onAddClick]);

  const hasEntities = query.items.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <header className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {query.title}
          </h1>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors duration-150 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleAddClick}
            aria-label="Add new entity"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Entity
          </button>
        </div>
      </header>

      <main className="p-6">
        {!hasEntities ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              No entities yet. Click "Add Entity" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-1" role="list" aria-label="Query entities">
            {query.items.map((entity) => (
              <EntityItem
                key={entity.id}
                entity={entity}
                onRemove={onRemoveEntity}
                onAdd={onAddEntity}
                query={query}
                onQueryChange={onQueryChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
