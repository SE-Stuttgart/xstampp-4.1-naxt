import { InformationFlowType, State, SystemComponentType } from '@src-shared/Enums';
import { IdString, Label, Named, ProjectId, Stated } from '@src-shared/Interfaces';

export class RoleInTheAccident implements ProjectId, IdString, Label, Named, Stated {
  readonly id: string = '';
  readonly projectId: string = '';

  readonly componentId: number = -1;
  readonly componentType: SystemComponentType | InformationFlowType = SystemComponentType.Actuator;

  readonly label: string = '';

  readonly name: string = '';
  readonly state: State = State.TODO;
  readonly rule: string = '';
  readonly description: string = '';
  readonly explanation: string = '';

  readonly currentValue: string = '';
  readonly flawProcessVariable: string = '';
}
