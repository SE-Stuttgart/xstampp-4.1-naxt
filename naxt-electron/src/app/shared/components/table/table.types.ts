import { NestedModels } from '@stpa/src/main/services/models';

export interface ColumnDefinition {
  label: string;
  key: string;

  searchable?: boolean;
  hidden?: boolean;
  preSet?: boolean;
  value?: string;
  fixed?: boolean;
  operator?: 'and' | 'or' | 'andnot' | 'ornot';
}

export interface TableEntity {
  readonly id: string;
  state: EntityState;
}

export enum EntityState {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE',
}

export interface TableDeleteEmit<T> {
  row: T;
  rows: T[];
}

export enum ExpandTimings {
  SHORT = 50,
  REGULAR = 100,
  LONG = 1000,
}

export enum UpdateTiming {
  REGUALR = 100,
  LONG = 550,
}

export interface NestedEmit {
  main: NestedModels;
  sub: NestedModels;
}
