import { ProjectId } from '@src-shared/Interfaces';
import { ControllerId, SafetyInformationSystemId } from './Interfaces';

export class SafetyInformationSystemControllerLink implements ProjectId, ControllerId, SafetyInformationSystemId {
  projectId: string = '';
  controllerId: number = -1;
  safetyInformationSystemId: string = '';
}
