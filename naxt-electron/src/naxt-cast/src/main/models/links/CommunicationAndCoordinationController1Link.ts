import { ProjectId } from '@src-shared/Interfaces';
import { CommunicationAndCoordinationId, ControllerId } from './Interfaces';

export abstract class CommunicationAndCoordinationControllerLink
  implements ProjectId, CommunicationAndCoordinationId, ControllerId {
  projectId: string = '';
  controllerId: number = -1;
  communicationAndCoordinationId: string = '';
}

export class CommunicationAndCoordinationController1Link extends CommunicationAndCoordinationControllerLink {}
export class CommunicationAndCoordinationController2Link extends CommunicationAndCoordinationControllerLink {}
