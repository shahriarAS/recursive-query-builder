import { useState } from 'react';
import type { Query } from '../types';
import { filterEntity } from '../utils/entityUtils';
import { QueryBuilder } from './QueryBuilder';
import { OpenModal } from './OpenModal';

export function useQueryBuilder() {
  const [currentId, setCurrentId] = useState(12);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [clickedId, setClickedId] = useState<number>(0);
  const [query, setQuery] = useState<Query>({
    title: "Query Builder",
    items: [],
  });

  const removeHandler = (id: number) => {
    const filteredQueryItems = filterEntity(query.items, id);
    setQuery({
      title: query.title,
      items: filteredQueryItems,
    });
  };

  const addHelper = (id: number) => {
    setClickedId(id);
    setShowOpenModal(true);
  };

  const handleAddClick = () => {
    setClickedId(0);
    setShowOpenModal(true);
  };

  const incrementId = () => {
    setCurrentId(prev => prev + 1);
  };

  return {
    query,
    setQuery,
    showOpenModal,
    setShowOpenModal,
    clickedId,
    currentId,
    removeHandler,
    addHelper,
    handleAddClick,
    incrementId,
  };
}

export function QueryBuilderContainer() {
  const {
    query,
    setQuery,
    showOpenModal,
    setShowOpenModal,
    clickedId,
    currentId,
    removeHandler,
    addHelper,
    handleAddClick,
    incrementId,
  } = useQueryBuilder();

  return (
    <>
      <QueryBuilder
        query={query}
        setQuery={setQuery}
        removeHandler={removeHandler}
        addHelper={addHelper}
        onAddClick={handleAddClick}
      />

      {showOpenModal && (
        <OpenModal
          setShowOpenModal={setShowOpenModal}
          query={query}
          setQuery={setQuery}
          clickedID={clickedId}
          currentId={currentId}
          onIdIncrement={incrementId}
        />
      )}
    </>
  );
}
