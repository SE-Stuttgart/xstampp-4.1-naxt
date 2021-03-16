import { ProjectId } from '@src-shared/Interfaces';
import { HazardId, SystemConstraintId } from './Interfaces';

export class HazardSystemConstraintLink implements ProjectId, HazardId, SystemConstraintId {
  projectId: string = '';
  systemConstraintId: number = -1;
  hazardId: number = -1;
}
