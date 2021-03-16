import { Project } from '@src-shared/project/Project';
import { ProjectService } from '@src-shared/project/ProjectService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ProjectController {
  constructor(@inject(ProjectService) private projectService: ProjectService) {}

  public async create(project: Project): Promise<Project> {
    return this.projectService.create(project);
  }

  public async update(project: Project): Promise<Project | null> {
    return await this.projectService.update(project);
  }

  public async remove(project: Project): Promise<boolean> {
    return await this.projectService.remove(project);
  }

  public async get(projectId: string): Promise<Project | null> {
    return this.projectService.get(projectId);
  }

  public get$(projectId: string): Observable<Project | null> {
    return this.projectService.get$(projectId);
  }

  public async getAll(): Promise<Project[]> {
    return this.projectService.getAll();
  }

  public getAll$(): Observable<Project[]> {
    return this.projectService.getAll$();
  }
}
