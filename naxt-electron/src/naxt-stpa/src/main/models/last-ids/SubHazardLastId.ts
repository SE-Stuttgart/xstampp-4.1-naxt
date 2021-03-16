import { LastId, ProjectId } from '@src-shared/Interfaces';

export class SubHazardLastId implements ProjectId, LastId {
  readonly projectId: string = '';
  readonly hazardId: number = -1;
  readonly lastId: number = -1;
}
