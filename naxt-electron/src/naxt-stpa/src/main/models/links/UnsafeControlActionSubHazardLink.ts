import { ProjectId } from '@src-shared/Interfaces';
import { ControlActionId, HazardId, SubHazardId, UnsafeControlActionId } from './Interfaces';

export class UnsafeControlActionSubHazardLink
  implements ProjectId, ControlActionId, UnsafeControlActionId, HazardId, SubHazardId {
  projectId: string = '';
  controlActionId: number = -1;
  unsafeControlActionId: number = -1;
  hazardId: number = -1;
  subHazardId: number = -1;
}
