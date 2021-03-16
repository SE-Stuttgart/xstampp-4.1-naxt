import { Described, LinkedDocuments, ProjectId } from '@src-shared/Interfaces';

export class CommunicationAndCoordinationDescription implements ProjectId, Described {
  readonly projectId: string = '';
  description: string = '';
  linkedDocuments = new Array<LinkedDocuments>();
}
