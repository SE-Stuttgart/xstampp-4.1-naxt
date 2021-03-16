import { LastId, ProjectId } from '@src-shared/Interfaces';

export class ProjectEntityLastId implements ProjectId, LastId {
  readonly projectId: string = '';
  readonly entity: string = '';
  readonly lastId: number = -1;
}
