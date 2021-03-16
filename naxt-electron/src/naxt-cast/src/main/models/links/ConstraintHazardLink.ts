import { ProjectId } from '@src-shared/Interfaces';
import { ConstraintId, HazardId } from './Interfaces';

export class ConstraintHazardLink implements ProjectId, HazardId, ConstraintId {
  projectId: string = '';
  hazardId: string = '';
  constraintId: string = '';
}
