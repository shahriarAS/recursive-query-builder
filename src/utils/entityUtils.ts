import type { Entity } from '../types';

let draggedEntity: Entity | null = null;

export const getDraggedEntity = (): Entity | null => draggedEntity;

export const setDraggedEntity = (entity: Entity | null): void => {
  draggedEntity = entity;
};

export const createPreviewEntity = (entity: Entity, multiplier: number = 50): Entity => ({
  ...entity,
  id: entity.id * multiplier,
  items: [],
});

export const isPreviewEntity = (entity: Entity, originalId: number, multiplier: number = 50): boolean => {
  return entity.id === originalId * multiplier;
};

export const removeEntityById = (items: Entity[], targetId: number): Entity[] => {
  return items
    .filter(item => item.id !== targetId)
    .map(item => ({
      ...item,
      items: removeEntityById(item.items, targetId),
    }));
};


export const findEntityById = (items: Entity[], targetId: number): Entity | null => {
  for (const item of items) {
    if (item.id === targetId) {
      return item;
    }
    
    const found = findEntityById(item.items, targetId);
    if (found) {
      return found;
    }
  }
  return null;
};


export const addEntityToParent = (
  items: Entity[], 
  parentId: number, 
  newEntity: Entity
): Entity[] => {
  return items.map(item => {
    if (item.id === parentId) {
      return {
        ...item,
        items: [...item.items, newEntity],
      };
    }
    
    return {
      ...item,
      items: addEntityToParent(item.items, parentId, newEntity),
    };
  });
};

export const moveEntity = (
  items: Entity[], 
  sourceId: number, 
  targetParentId: number
): Entity[] => {
  const entityToMove = findEntityById(items, sourceId);
  
  if (!entityToMove) {
    return items;
  }

  const itemsWithoutSource = removeEntityById(items, sourceId);
  
  return addEntityToParent(itemsWithoutSource, targetParentId, entityToMove);
};
