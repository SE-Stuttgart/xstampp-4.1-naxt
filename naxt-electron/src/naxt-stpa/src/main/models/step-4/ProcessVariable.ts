import { State } from '@src-shared/Enums';
import { Arrowed, Described, Named, ProjectDependent, Stated } from '@src-shared/Interfaces';

export enum VariableType {
  Discrete = 'DISCREET', // ridicules...
  Continuous = 'INDISCREET', // ...pure madness
}

export class ProcessVariable implements ProjectDependent, Named, Described, Stated, Arrowed {
  readonly id: number = -1;
  readonly projectId: string = '';

  readonly arrowId: string = '';
  readonly variable_type: VariableType = VariableType.Discrete;

  readonly nuSMVName: string = '';
  readonly spinName: string = '';

  readonly name: string = ``;
  readonly description: string = '';
  readonly state: State = State.TODO;
}
