import { ProjectType, State } from '@src-shared/Enums';
import { Described, Named, ProjectId, Stated } from '@src-shared/Interfaces';

export class Project implements ProjectId, Named, Described, Stated {
  readonly projectId: string = '';

  readonly filePath: string = '';
  readonly fileName: string = '';
  readonly projectType: ProjectType = ProjectType.STPA;

  readonly unsavedChanges: boolean = false;

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;
}
