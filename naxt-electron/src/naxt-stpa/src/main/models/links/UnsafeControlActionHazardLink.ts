import { ProjectId } from '@src-shared/Interfaces';
import { ControlActionId, HazardId, UnsafeControlActionId } from './Interfaces';

export class UnsafeControlActionHazardLink implements ProjectId, ControlActionId, UnsafeControlActionId, HazardId {
  projectId: string = '';
  controlActionId: number = -1;
  unsafeControlActionId: number = -1;
  hazardId: number = -1;
}
