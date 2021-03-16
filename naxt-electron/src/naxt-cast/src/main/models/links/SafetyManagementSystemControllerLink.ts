import { ProjectId } from '@src-shared/Interfaces';
import { ControllerId, SafetyManagementSystemId } from './Interfaces';

export class SafetyManagementSystemControllerLink implements ProjectId, ControllerId, SafetyManagementSystemId {
  projectId: string = '';
  controllerId: number = -1;
  safetyManagementSystemId: string = '';
}
