import type { Entity } from '../types';

// Global variable for found entity (consider refactoring this to avoid global state)
let foundEntity: Entity;

export const getFoundEntity = () => foundEntity;
export const setFoundEntity = (entity: Entity) => {
  foundEntity = entity;
};

/**
 * Recursively filters out an entity with the specified ID from the items array
 */
export function filterEntity(items: Entity[], id: number): Entity[] {
  const filtered: Entity[] = [];

  items.forEach((item) => {
    if (item.id !== id) {
      if (item.items.length !== 0) {
        filtered.push({
          ...item,
          items: filterEntity(item.items, id),
        });
      } else {
        filtered.push(item);
      }
    }
  });

  return filtered;
}

/**
 * Recursively finds an entity by ID and sets it to foundEntity
 */
export function findEntity(items: Entity[], id: number): Entity | undefined {
  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    if (element.id === id) {
      foundEntity = element;
      return element;
    } else {
      const found = findEntity(element.items, id);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Recursively adds a new entity to the specified parent entity by ID
 */
export function addEntityToParent(items: Entity[], parentId: number, newEntity: Entity): Entity[] {
  const updated: Entity[] = [];

  items.forEach((item) => {
    if (item.id === parentId) {
      updated.push({
        ...item,
        items: [...item.items, newEntity],
      });
    } else {
      updated.push({
        ...item,
        items: addEntityToParent(item.items, parentId, newEntity),
      });
    }
  });

  return updated;
}
