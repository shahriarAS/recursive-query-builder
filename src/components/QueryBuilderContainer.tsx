import { useState, useCallback } from 'react';
import type { Query } from '../types';
import { removeEntityById } from '../utils/entityUtils';
import { QueryBuilder } from './QueryBuilder';
import { OpenModal } from './OpenModal';

const INITIAL_QUERY: Query = {
  title: "Query Builder",
  items: [],
} as const;

const INITIAL_ENTITY_ID = 12;

export function useQueryBuilder() {
  const [currentId, setCurrentId] = useState(INITIAL_ENTITY_ID);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number>(0);
  const [query, setQuery] = useState<Query>(INITIAL_QUERY);

  const removeEntity = useCallback((id: number) => {
    setQuery(prevQuery => ({
      ...prevQuery,
      items: removeEntityById(prevQuery.items, id),
    }));
  }, []);

  const openAddModal = useCallback((parentId: number) => {
    setSelectedParentId(parentId);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedParentId(0);
  }, []);

  const handleAddRootEntity = useCallback(() => {
    openAddModal(0);
  }, [openAddModal]);

  const incrementEntityId = useCallback(() => {
    setCurrentId(prev => prev + 1);
  }, []);

  return {
    query,
    setQuery,
    isModalOpen,
    selectedParentId,
    currentId,
    
    removeEntity,
    openAddModal,
    closeModal,
    handleAddRootEntity,
    incrementEntityId,
  };
}

export function QueryBuilderContainer() {
  const {
    query,
    setQuery,
    isModalOpen,
    selectedParentId,
    currentId,
    removeEntity,
    openAddModal,
    closeModal,
    handleAddRootEntity,
    incrementEntityId,
  } = useQueryBuilder();

  return (
    <>
      <QueryBuilder
        query={query}
        onQueryChange={setQuery}
        onRemoveEntity={removeEntity}
        onAddEntity={openAddModal}
        onAddClick={handleAddRootEntity}
      />

      <OpenModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onQueryChange={setQuery}
        parentId={selectedParentId}
        nextEntityId={currentId + 1}
        onEntityCreated={incrementEntityId}
      />
    </>
  );
}
