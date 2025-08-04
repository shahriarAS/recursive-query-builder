import { type DragEvent, useCallback, useState } from "react";
import type { Entity, Query } from '../types';
import { 
  findEntityById, 
  getDraggedEntity, 
  setDraggedEntity, 
  removeEntityById, 
  addEntityToParent,
  moveEntity,
  createPreviewEntity,
  isPreviewEntity
} from '../utils/entityUtils';

interface EntityItemProps {
  entity: Entity;
  onRemove: (id: number) => void;
  onAdd: (id: number) => void;
  query: Query;
  onQueryChange: React.Dispatch<React.SetStateAction<Query>>;
}

const DRAG_PREVIEW_ID_MULTIPLIER = 50;

export function EntityItem({
  entity,
  onRemove,
  onAdd,
  query,
  onQueryChange,
}: EntityItemProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = useCallback((event: DragEvent<HTMLDivElement>) => {
    const entityId = Number(event.currentTarget.id);
    const draggedEntity = findEntityById(query.items, entityId);
    
    if (draggedEntity) {
      event.dataTransfer.setData("text/plain", entityId.toString());
      event.dataTransfer.effectAllowed = "move";
      setDraggedEntity(draggedEntity);
    }
  }, [query.items]);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";

    const targetId = Number(event.currentTarget.id);
    const draggedEntity = getDraggedEntity();

    if (draggedEntity && draggedEntity.id !== targetId && entity.type === "GROUP") {
      setIsDragOver(true);
      
      const previewId = draggedEntity.id * DRAG_PREVIEW_ID_MULTIPLIER;
      const hasPreview = entity.items.some(item => item.id === previewId);
      
      if (!hasPreview) {
        const previewEntity = createPreviewEntity(draggedEntity, DRAG_PREVIEW_ID_MULTIPLIER);
        
        onQueryChange(prevQuery => ({
          ...prevQuery,
          items: addEntityToParent(prevQuery.items, targetId, previewEntity),
        }));
      }
    }
  }, [onQueryChange, entity.type, entity.items]);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    const isStillInside = (
      x >= rect.left && 
      x <= rect.right && 
      y >= rect.top && 
      y <= rect.bottom
    );
    
    if (!isStillInside) {
      setIsDragOver(false);
      const draggedEntity = getDraggedEntity();
      
      if (draggedEntity) {
        const previewId = draggedEntity.id * DRAG_PREVIEW_ID_MULTIPLIER;
        onQueryChange(prevQuery => ({
          ...prevQuery,
          items: removeEntityById(prevQuery.items, previewId),
        }));
      }
    }
  }, [onQueryChange]);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const targetId = Number(event.currentTarget.id);
    const sourceId = Number(event.dataTransfer.getData("text/plain"));
    const draggedEntity = getDraggedEntity();

    if (draggedEntity && sourceId !== targetId && entity.type === "GROUP") {
      const previewId = draggedEntity.id * DRAG_PREVIEW_ID_MULTIPLIER;
      const itemsWithoutPreview = removeEntityById(query.items, previewId);
      
      const updatedItems = moveEntity(itemsWithoutPreview, sourceId, targetId);
      
      onQueryChange(prevQuery => ({
        ...prevQuery,
        items: updatedItems,
      }));
    }

    setDraggedEntity(null);
  }, [query.items, onQueryChange, entity.type]);

  const handleAddClick = useCallback(() => {
    onAdd(entity.id);
  }, [entity.id, onAdd]);

  const handleRemoveClick = useCallback(() => {
    onRemove(entity.id);
  }, [entity.id, onRemove]);

  const hasChildren = entity.items.length > 0;
  const displayText = entity.title || entity.conditionType || 'Untitled';
  const isPreview = getDraggedEntity() && isPreviewEntity(entity, getDraggedEntity()!.id, DRAG_PREVIEW_ID_MULTIPLIER);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      id={entity.id.toString()}
      className="ml-6 mb-2"
    >
      <div
        id={entity.id.toString()}
        draggable={!isPreview}
        onDragStart={handleDragStart}
        className={`group flex items-center justify-between p-3 rounded-lg border transition-all duration-150 ${
          isPreview 
            ? 'bg-blue-50 border-blue-200 border-dashed opacity-70'
            : isDragOver && entity.type === "GROUP"
            ? 'bg-blue-50 border-blue-300 border-2'
            : 'bg-white hover:bg-gray-50 border-gray-200 cursor-move'
        }`}
        role="button"
        tabIndex={isPreview ? -1 : 0}
        aria-label={`${entity.type} ${displayText}`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium uppercase tracking-wider min-w-16 ${
            isPreview ? 'text-blue-500' : 'text-gray-500'
          }`}>
            {entity.type} - {entity.id}
            {isPreview && ' (Preview)'}
          </span>
          <p className={`font-medium ${
            isPreview ? 'text-blue-700' : 'text-gray-900'
          }`}>
            {displayText}
          </p>
        </div>
        
        {!isPreview && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {entity.type === "GROUP" && (
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150"
                onClick={handleAddClick}
                aria-label="Add child entity"
                title="Add child entity"
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
              </button>
            )}
            
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-150"
              onClick={handleRemoveClick}
              aria-label="Remove entity"
              title="Remove entity"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {hasChildren && (
        <div className={`mt-2 pl-4 border-l transition-colors duration-150 ${
          isDragOver && entity.type === "GROUP" ? 'border-blue-300' : 'border-gray-200'
        }`}>
          {entity.items.map((childEntity) => (
            <EntityItem
              key={childEntity.id}
              entity={childEntity}
              onRemove={onRemove}
              onAdd={onAdd}
              query={query}
              onQueryChange={onQueryChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}