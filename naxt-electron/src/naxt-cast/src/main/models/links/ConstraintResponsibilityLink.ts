import { ProjectId } from '@src-shared/Interfaces';
import { ConstraintId, ResponsibilityId } from './Interfaces';

export class ConstraintResponsibilityLink implements ProjectId, ConstraintId, ResponsibilityId {
  projectId: string = '';
  constraintId: string = '';
  responsibilityId: string = '';
}
