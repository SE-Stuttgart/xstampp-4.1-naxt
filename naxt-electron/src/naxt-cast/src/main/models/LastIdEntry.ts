import { LastId, ProjectId } from '@src-shared/Interfaces';

export class LastIdEntry implements ProjectId, LastId {
  projectId: string = '';
  entry: string = '';
  dependentsOn: string = '';
  lastId: number = 0;
}
