import { ProjectId } from '@src-shared/Interfaces';
import { ControllerId, InternalAndExternalEconomicsId } from './Interfaces';

export class InternalAndExternalEconomicsControllerLink
  implements ProjectId, ControllerId, InternalAndExternalEconomicsId {
  projectId: string = '';
  controllerId: number = -1;
  internalAndExternalEconomicsId: string = '';
}
