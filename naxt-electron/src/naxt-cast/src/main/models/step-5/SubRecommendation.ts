import { Duration, State } from '@src-shared/Enums';
import { Described, IdString, Label, Named, ParentIdString, ProjectId, Stated } from '@src-shared/Interfaces';

export class SubRecommendation implements ProjectId, ParentIdString, IdString, Label, Named, Described, Stated {
  readonly id: string = '';
  readonly parentId: string = '';
  readonly projectId: string = '';

  readonly label: string = '';

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;
  readonly personInCharge: string = '';
  readonly duration: Duration = Duration.IMMIDIATELY;
}
