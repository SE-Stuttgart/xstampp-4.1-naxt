import { State } from '@src-shared/Enums';
import { Described, EntityDependent, Named, Stated } from '@src-shared/Interfaces';

// this is a conversion only for actuators
// to keep compatibility with the old XSTAMPP4 conversions for sensors have a own model (ConversionSensor)
export class Conversion implements EntityDependent, Named, Described, Stated {
  readonly id: number = -1;
  readonly parentId: number = -1;
  readonly projectId: string = '';

  readonly conversion: string = '';
  readonly controlActionId: number = -1; // linked control action
  readonly actuatorId: number = -1; // equals parentId

  readonly name: string;
  readonly description: string;
  readonly state: State = State.TODO;
}
