import { ProjectService } from '@cast/src/main/services';
import { ProjectController as BasicProjectController } from '@src-shared/project/ProjectController';
import { inject, injectable } from 'inversify';

@injectable()
export class ProjectController extends BasicProjectController {
  constructor(@inject(ProjectService) projectService: ProjectService) {
    super(projectService);
  }
}
