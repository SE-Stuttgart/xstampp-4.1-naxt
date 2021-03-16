import { Id, IdString, Named } from '@src-shared/Interfaces';

export interface FilterChip {
  key: string;
  label: string;

  fixed?: boolean;
  preSet?: boolean;
  value?: string;

  andOperator?: boolean;
  orOperator?: boolean;
  notOperator?: boolean;

  stateChip?: boolean;
}
export type FilterEntry = (Id | IdString) & Named;
