import { ProjectId } from '@src-shared/Interfaces';

// all POSSIBLE! discrete variable values for a process variable
export class DiscreteProcessVariableValue implements ProjectId {
  readonly projectId: string = '';

  readonly processVariableId: number = -1;
  readonly variableValue: string = '';
}
