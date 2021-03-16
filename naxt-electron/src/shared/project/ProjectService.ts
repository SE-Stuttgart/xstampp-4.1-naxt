import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';
import { Observable } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';

@injectable()
export class ProjectService {
  protected readonly projectRepo: Repository<Project>;
  constructor(@unmanaged() projectRepo: Repository<Project>) {
    this.projectRepo = projectRepo;
  }

  public async create(project: Project): Promise<Project> {
    return this.projectRepo.insert({ ...project, projectId: uuidV4() });
  }

  public async update(project: Project): Promise<Project | null> {
    return await this.projectRepo.update(project);
  }

  public async remove(project: Project): Promise<boolean> {
    return await this.projectRepo._remove({ ...new Project(), projectId: project.projectId });
  }

  public async get(projectId: string): Promise<Project | null> {
    return this.projectRepo._find({ ...new Project(), projectId: projectId });
  }

  public get$(projectId: string): Observable<Project> {
    return this.projectRepo._find$({ ...new Project(), projectId: projectId });
  }

  public async getAll(): Promise<Project[]> {
    return this.projectRepo.findAll();
  }

  public getAll$(): Observable<Project[]> {
    return this.projectRepo.findAll$();
  }
}
