import { LastId, ProjectId } from '@src-shared/Interfaces';

export class ConversionLastId implements ProjectId, LastId {
  readonly projectId: string = '';
  readonly actuatorId: number = -1;
  readonly lastId: number = -1;
}
