// Types
export type EntityType = "GROUP" | "CONDITION";
export type ConditionType = "AND" | "OR";

export type Entity = {
  id: number;
  type: EntityType;
  conditionType?: ConditionType;
  title: string;
  items: Entity[];
};

export type Query = {
  title: string;
  items: Entity[];
};
