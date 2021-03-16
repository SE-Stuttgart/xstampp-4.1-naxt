import { ProjectId } from '@src-shared/Interfaces';
import { HazardId, LossId } from './Interfaces';

export class HazardLossLink implements ProjectId, HazardId, LossId {
  projectId: string = '';
  lossId: number = -1;
  hazardId: number = -1;
}
