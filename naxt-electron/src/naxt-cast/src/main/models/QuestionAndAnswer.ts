import { State } from '@src-shared/Enums';
import { IdString, Label, ProjectId, Stated } from '@src-shared/Interfaces';

export class QuestionAndAnswer implements ProjectId, IdString, Label, Stated {
  readonly projectId: string = '';
  readonly id: string = '';

  readonly label: string = '';

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;
}
