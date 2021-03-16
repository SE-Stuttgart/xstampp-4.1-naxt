import { ProjectId } from '@src-shared/Interfaces';
import { ResponsibilityId, SystemConstraintId } from './Interfaces';

export class ResponsibilitySystemConstraintLink implements ProjectId, SystemConstraintId, ResponsibilityId {
  projectId: string = '';
  systemConstraintId: number = -1;
  responsibilityId: number = -1;
}
