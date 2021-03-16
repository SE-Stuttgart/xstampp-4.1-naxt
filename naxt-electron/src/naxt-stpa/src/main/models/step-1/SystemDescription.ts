import { Described, ProjectId, LinkedDocuments as _LinkedDocuments } from '@src-shared/Interfaces';

export class SystemDescription implements ProjectId, Described {
  readonly projectId: string = '';
  description: string = '';
}

export class LinkedDocuments {
  readonly projectId: string = '';
  linkedDocuments = new Array<_LinkedDocuments>();
}
