import { ProjectId } from '@src-shared/Interfaces';
import { ResponsibilityId, SubSystemConstraintId, SystemConstraintId } from './Interfaces';

export class ResponsibilitySubSystemConstraintLink
  implements ProjectId, SystemConstraintId, SubSystemConstraintId, ResponsibilityId {
  projectId: string = '';
  systemConstraintId: number = -1;
  subSystemConstraintId: number = -1;
  responsibilityId: number = -1;
}
