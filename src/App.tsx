import { useState } from "react";
import "./App.css";

let ID = 12;

type EntityType = "GROUP" | "CONDITION";

type Entity = {
  id: number;
  type: EntityType;
  title: string;
  items: Entity[];
};

type Query = {
  title: string;
  items: Entity[];
};

function myFilter(items: Entity[], id: number): Entity[] {
  const filtered: Entity[] = [];

  items.forEach((i) => {
    if (i.id != id) {
      if (i.items.length != 0) {
        filtered.push({
          ...i,
          items: myFilter(i.items, id),
        });
      } else {
        filtered.push(i);
      }
    }
  });

  return filtered;
}

function myAdder(items: Entity[], id: number, newEntity: Entity): Entity[] {
  const filtered: Entity[] = [];

  items.forEach((i) => {
    if (i.id == id) {
      filtered.push({
        ...i,
        items: [...i.items, newEntity],
      });
    } else {
      filtered.push({
        ...i,
        items: myAdder(i.items, id, newEntity),
      });
    }
  });

  return filtered;
}

function EntityReturn({
  entity,
  removeHandler,
  addHelper,
}: {
  entity: Entity;
  removeHandler: (id: number) => void;
  addHelper: (id: number) => void;
}) {
  if (entity.items.length == 0) {
    return (
      <div className="ml-8 mt-1 flex gap-2">
        <p className="">{entity.title}</p>
        <span
          className="cursor-pointer"
          onClick={() => removeHandler(entity.id)}
        >
          [x]
        </span>
        {entity.type == "GROUP" && (
          <span className="cursor-pointer" onClick={() => addHelper(entity.id)}>
            [+]
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="ml-8 mt-1">
        <div className="flex gap-2">
          <p className="">{entity.title}</p>
          <span
            className="cursor-pointer"
            onClick={() => removeHandler(entity.id)}
          >
            [x]
          </span>
          {entity.type == "GROUP" && (
            <span
              className="cursor-pointer"
              onClick={() => addHelper(entity.id)}
            >
              [+]
            </span>
          )}
        </div>

        {entity.items.map((subEntity) => (
          <EntityReturn
            key={subEntity.id}
            entity={subEntity}
            removeHandler={removeHandler}
            addHelper={addHelper}
          />
        ))}
      </div>
    </>
  );
}

function App() {
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [clickedId, setClickedId] = useState<number>(0);
  const [query, setQuery] = useState<Query>({
    title: "Query Builder",
    items: [],
  });

  const removeHandler = (id: number) => {
    const filteredQueryItems = myFilter(query.items, id);
    setQuery({
      title: query.title,
      items: filteredQueryItems,
    });
  };

  const addHelper = (id: number) => {
    setClickedId(id);
    setShowOpenModal(true);
  };

  return (
    <>
      <div className="root flex flex-col gap-1">
        <div className="flex gap-2">
          <p className="text-lg font-medium">{query.title}</p>
          <span
            className="cursor-pointer"
            onClick={() => {
              setClickedId(0);
              setShowOpenModal(true);
            }}
          >
            [+]
          </span>
        </div>
        {query.items.map((entity) => (
          <EntityReturn
            key={entity.id}
            entity={entity}
            removeHandler={removeHandler}
            addHelper={addHelper}
          />
        ))}
      </div>
      {showOpenModal && (
        <OpenModal
          setShowOpenModal={setShowOpenModal}
          query={query}
          setQuery={setQuery}
          clickedID={clickedId}
        />
      )}
    </>
  );
}

export default App;

function OpenModal({
  setShowOpenModal,
  query,
  setQuery,
  clickedID,
}: {
  setShowOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  query: Query;
  setQuery: React.Dispatch<React.SetStateAction<Query>>;
  clickedID: number;
}) {
  const [newEntity, setNewEntity] = useState<Entity>({
    id: ID + 1,
    type: "GROUP",
    title: "",
    items: [],
  });

  const addHandler = (id: number) => {
    const cloneQuery: Query = JSON.parse(JSON.stringify(query));
    if (id == 0) {
      setQuery({
        title: query.title,
        items: [newEntity],
      });
    } else {
      setQuery({
        title: query.title,
        items: myAdder(cloneQuery.items, id, newEntity),
      });
    }
    ID++;
    setShowOpenModal(false);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-screen bg-black/50 flex items-center justify-center">
      <div className="bg-white w-80 h-56 p-4 text-center">
        <p>Add Entity</p>
        <form>
          <select
            value={newEntity.type}
            onChange={(val) =>
              setNewEntity({
                ...newEntity,
                type: val.target.value as EntityType,
              })
            }
            className="border p-1"
          >
            <option value={"GROUP"}>Group</option>
            <option value={"CONDITION"}>Condition</option>
          </select>
          <input
            value={newEntity.title}
            onChange={(val) =>
              setNewEntity({
                ...newEntity,
                title: val.target.value,
              })
            }
            type="text"
            placeholder="Title/Content"
            className="border"
          />
          <button
            onClick={(event) => {
              event.preventDefault();
              addHandler(clickedID);
            }}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
