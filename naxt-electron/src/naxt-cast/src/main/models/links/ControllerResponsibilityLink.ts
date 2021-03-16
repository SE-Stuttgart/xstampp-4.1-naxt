import { ProjectId } from '@src-shared/Interfaces';
import { ControllerId, ResponsibilityId } from './Interfaces';

export class ControllerResponsibilityLink implements ProjectId, ResponsibilityId, ControllerId {
  projectId: string = '';
  controllerId: number = -1;
  responsibilityId: string = '';
}
