import { LastId, ProjectId } from '@src-shared/Interfaces';

export class RuleLastId implements ProjectId, LastId {
  readonly projectId: string = '';
  readonly controllerId: number = -1;
  readonly lastId: number = -1;
}
