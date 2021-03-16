import { LastId, ProjectId } from '@src-shared/Interfaces';

export class UnsafeControlActionLastId implements ProjectId, LastId {
  readonly projectId: string = '';
  readonly controlActionId: number = -1;
  readonly lastId: number = -1;
}
