import { IdString, Label, Named, ProjectId } from '@src-shared/Interfaces';

export class ProcessVariable implements ProjectId, IdString, Label, Named {
  readonly id: string = '';
  readonly projectId: string = '';

  readonly label: string = '';

  readonly controllerId: number = -1;
  readonly name: string = '';

  readonly currentValue: string = '';
  readonly flaws: string = '';
}
