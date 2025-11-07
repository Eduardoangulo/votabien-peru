export type FilterOperator =
  | "eq"
  | "ne"
  | "iLike"
  | "notILike"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "isBetween"
  | "isRelativeToToday"
  | "isEmpty"
  | "isNotEmpty";

export type JoinOperator = "AND" | "OR";

export type TextFilter = {
  id: string;
  operator: FilterOperator;
  value: string;
  type: "text";
};

export type NumberFilter = {
  id: string;
  operator: FilterOperator;
  value: number;
  type: "number";
};

export type BooleanFilter = {
  id: string;
  operator: FilterOperator;
  value: boolean | string;
  type: "boolean";
};

export type DateFilter = {
  id: string;
  operator: FilterOperator;
  value: string | [string, string];
  type: "date";
};

export type SelectFilter = {
  id: string;
  operator: FilterOperator;
  value: string;
  type: "select";
};

export type MultiSelectFilter = {
  id: string;
  operator: FilterOperator;
  value: string[];
  type: "multi-select";
};

export type Filter =
  | TextFilter
  | NumberFilter
  | BooleanFilter
  | DateFilter
  | SelectFilter
  | MultiSelectFilter;
