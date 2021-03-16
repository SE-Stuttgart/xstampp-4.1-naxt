import { Described, LinkedDocuments, ProjectId } from '@src-shared/Interfaces';

export class SafetyCultureDescription implements ProjectId, Described {
  readonly projectId: string = '';
  description: string = '';
  linkedDocuments = new Array<LinkedDocuments>();
}
