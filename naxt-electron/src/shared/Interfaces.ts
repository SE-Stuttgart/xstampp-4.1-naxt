import { State } from './Enums';

// Indexes
export interface ProjectId {
  projectId: string;
}

export interface ParentId {
  parentId: number;
}

export interface Id {
  id: number;
}

export interface IdString {
  id: string;
}

export interface Label {
  label: string;
}

export interface ParentIdString {
  parentId: string;
}

export interface ProjectDependent extends Id, ProjectId {}

export interface EntityDependent extends ProjectDependent, ParentId {}

// Common Properties
export interface Named {
  name: string;
}

export interface Described {
  description: string;
}

export interface Stated {
  state: State;
}

export interface TableId {
  tableId: string;
}
export interface LinkedDocuments {
  fileName: string;
  path: string;
  type: string;
}
export interface TableEntry extends Named, Described, Stated, TableId {}

// Control Structure related

export interface Arrowed {
  arrowId: string;
}

export interface Boxed {
  boxId: string;
}

// Index Util
export interface LastId {
  lastId: number;
}

export interface NextId<T> {
  nextId: (projectId: string, clazz: { new (): T }) => Promise<number>;
}

export interface UnchangedSavesSetter {
  setUnsavedChanges: (string, boolean) => Promise<void>;
}
