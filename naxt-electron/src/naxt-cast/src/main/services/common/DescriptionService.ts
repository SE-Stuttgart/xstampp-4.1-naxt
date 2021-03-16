import { ProjectRepo } from '@cast/src/main/repositories';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { ProjectId } from '@src-shared/Interfaces';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class DescriptionService<T extends ProjectId> {
  constructor(
    @unmanaged() private readonly clazz: { new (): T },
    @unmanaged() private readonly projectRepo: ProjectRepo,
    @unmanaged() private readonly descriptionRepo: Repository<T>
  ) {}

  public async create(projectId: string): Promise<T> {
    const projectExists = await this.projectRepo.exists(projectId);
    if (!projectExists) throw new NAXTError('No such project exists:', projectId);
    return this.descriptionRepo.insert({ ...new this.clazz(), projectId });
  }

  public async update(descriptionModel: T): Promise<T | null> {
    await this.projectRepo.setUnsavedChanges(descriptionModel.projectId, true);
    return this.descriptionRepo.update(descriptionModel);
  }

  public async get(projectId: string): Promise<T | null> {
    return this.descriptionRepo._find({ ...new this.clazz(), projectId: projectId });
  }

  public get$(projectId: string): Observable<T> {
    return this.descriptionRepo._find$({ ...new this.clazz(), projectId: projectId });
  }
}
