import { LastId, ProjectId } from '@src-shared/Interfaces';

export class SubSystemConstraintLastId implements ProjectId, LastId {
  readonly projectId: string = '';
  readonly systemConstraintId: number = -1;
  readonly lastId: number = -1;
}
