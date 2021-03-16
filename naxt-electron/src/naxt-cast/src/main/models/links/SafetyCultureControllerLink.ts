import { ProjectId } from '@src-shared/Interfaces';
import { ControllerId, SafetyCultureId } from './Interfaces';

export class SafetyCultureControllerLink implements ProjectId, ControllerId, SafetyCultureId {
  projectId: string = '';
  controllerId: number = -1;
  safetyCultureId: string = '';
}
