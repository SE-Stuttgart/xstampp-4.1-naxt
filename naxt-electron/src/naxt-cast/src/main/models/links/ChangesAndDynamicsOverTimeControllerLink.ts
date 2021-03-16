import { ProjectId } from '@src-shared/Interfaces';
import { ChangesAndDynamicsOverTimeId, ControllerId } from './Interfaces';

export class ChangesAndDynamicsOverTimeControllerLink implements ProjectId, ChangesAndDynamicsOverTimeId, ControllerId {
  projectId: string = '';
  controllerId: number = -1;
  changesAndDynamicsOverTimeId: string = '';
}
