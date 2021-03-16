import { ProjectId } from '@src-shared/Interfaces';
import { ProcessVariableId, ResponsibilityId } from './Interfaces';

export class ProcessVariableResponsibilityLink implements ProjectId, ProcessVariableId, ResponsibilityId {
  projectId: string = '';
  processVariableId: number = -1;
  responsibilityId: number = -1;
}
