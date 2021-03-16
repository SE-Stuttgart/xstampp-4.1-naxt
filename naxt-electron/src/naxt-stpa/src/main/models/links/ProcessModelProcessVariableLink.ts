import { ProjectId } from '@src-shared/Interfaces';
import { ProcessModelId, ProcessVariableId } from './Interfaces';

export class ProcessModelProcessVariableLink implements ProjectId, ProcessModelId, ProcessVariableId {
  projectId: string = '';
  processModelId: number = -1;
  processVariableId: number = -1;
  processVariableValue: string = ''; // is the SELECTED! process variable (either Discrete [out of the possible ones] or Continuous [any string])
}
