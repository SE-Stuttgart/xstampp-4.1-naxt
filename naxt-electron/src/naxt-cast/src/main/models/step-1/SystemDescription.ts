import { ProjectId, Described, LinkedDocuments } from '@src-shared/Interfaces';

export class SystemDescription implements ProjectId, Described {
  readonly projectId: string = '';
  description: string = '';

  linkedDocuments = new Array<LinkedDocuments>();
}
