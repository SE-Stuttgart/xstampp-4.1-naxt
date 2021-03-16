import { Project } from '@src-shared/project/Project';
import { ProjectController as SharedProjectController } from '@src-shared/project/ProjectController';
import { ProjectService } from '@stpa/src/main/services/ProjectService';
import { inject, injectable } from 'inversify';

@injectable()
export class ProjectController extends SharedProjectController {
  constructor(@inject(ProjectService) projectService: ProjectService) {
    super(projectService);
  }

  async create(project: Project): Promise<Project> {
    return super.create(project);
  }
}
