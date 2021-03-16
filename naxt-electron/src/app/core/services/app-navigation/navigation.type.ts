import { Project } from '@src-shared/project/Project';

export interface NavigationPoint extends Project {
  subPath: string;
  keyValuePair?: KeyValuePair;
}

export class KeyValuePair {
  constructor(readonly value: string, readonly key: string = 'tableId') {}
}
