import type { DragEvent } from "react";
import type { Entity, Query } from '../types';
import { findEntity, getFoundEntity, filterEntity, addEntityToParent } from '../utils/entityUtils';

interface EntityItemProps {
  entity: Entity;
  removeHandler: (id: number) => void;
  addHelper: (id: number) => void;
  query: Query;
  setQuery: React.Dispatch<React.SetStateAction<Query>>;
}

export function EntityItem({
  entity,
  removeHandler,
  addHelper,
  query,
  setQuery,
}: EntityItemProps) {
  const dragStartHandler = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text", event.currentTarget.id);
    findEntity(query.items, Number(event.currentTarget.id));
  };

  const dragOverHandler = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const id = Number(event.currentTarget.id);
    const foundEntity = getFoundEntity();

    if (foundEntity) {
      setQuery({
        title: query.title,
        items: addEntityToParent(query.items, id, {
          ...foundEntity,
          id: foundEntity.id * 50,
        }),
      });
    }
  };

  const dragLeaveHandler = (_event: DragEvent<HTMLDivElement>) => {
    const foundEntity = getFoundEntity();
    if (foundEntity) {
      const filteredQueryItems = filterEntity(query.items, foundEntity.id * 50);
      setQuery({
        title: query.title,
        items: filteredQueryItems,
      });
    }
  };

  const moveHandler = (dropID: number, id: number) => {
    findEntity(query.items, id);
    const draggedEntity = getFoundEntity();

    if (!draggedEntity?.id) return;

    const filteredQueryItems = addEntityToParent(
      filterEntity(query.items, draggedEntity.id),
      dropID,
      { ...draggedEntity }
    );

    setQuery({
      title: query.title,
      items: filteredQueryItems,
    });
  };

  const dropHandler = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const draggedID = Number(event.dataTransfer.getData("text"));
    moveHandler(Number(event.currentTarget.id), draggedID);
  };

  return (
    <div
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}
      id={`${entity.id}`}
      className="ml-6 mb-2"
    >
      <div
        id={`${entity.id}`}
        draggable
        onDragStart={dragStartHandler}
        className="group flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider min-w-16">
            {entity.type} - {entity.id}
          </span>
          <p className="text-gray-900">
            {entity.title || entity.conditionType}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {entity.type === "GROUP" && (
            <button
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150"
              onClick={() => addHelper(entity.id)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
          <button
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-150"
            onClick={() => removeHandler(entity.id)}
          >
            <svg
              className="w-4 h-4"
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

      {entity.items.length !== 0 && (
        <div className="mt-2 pl-4 border-l border-gray-200">
          {entity.items.map((subEntity) => (
            <EntityItem
              key={subEntity.id}
              entity={subEntity}
              removeHandler={removeHandler}
              addHelper={addHelper}
              query={query}
              setQuery={setQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}
