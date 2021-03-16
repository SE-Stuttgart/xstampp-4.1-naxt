import { NAXTError } from '@src-shared/errors/NaxtError';
import { ProjectId } from '@src-shared/Interfaces';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ProjectRepo } from '@stpa/src/main/repositories';
import { injectable, unmanaged } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ProjectIdService<Type extends ProjectId> {
  constructor(
    @unmanaged() private readonly _clazz: { new (): Type },
    @unmanaged() private readonly _projectRepo: ProjectRepo,
    @unmanaged() private readonly _modelRepo: Repository<Type>
  ) {}

  public async create(obj: Type): Promise<Type> {
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return this.checkCreationRules(obj).then(() => this._modelRepo.insert(obj));
  }

  private async checkCreationRules(obj: Type): Promise<void> {
    const projectExists = await this._projectRepo.exists(obj.projectId);
    if (!projectExists) throw new NAXTError('No such [project] exists:', obj);
  }

  public async update(obj: Type): Promise<Type | null> {
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return await this._modelRepo.update(obj);
  }

  public async remove(obj: Type): Promise<boolean> {
    const { projectId } = obj;
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return await this._modelRepo._remove({ ...new this._clazz(), projectId });
  }

  public async get(projectId: string): Promise<Type | null> {
    return this._modelRepo._find({ ...new this._clazz(), projectId });
  }

  public get$(projectId: string): Observable<Type | null> {
    return this._modelRepo._find$({ ...new this._clazz(), projectId });
  }

  public async getAll(projectId: string): Promise<Type[]> {
    return this._modelRepo.findAll(projectId);
  }

  public getAll$(projectId: string): Observable<Type[]> {
    return this._modelRepo.findAll$(projectId);
  }
}
