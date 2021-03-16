import { NAXTError } from '@src-shared/errors/NaxtError';
import { ProjectDependent } from '@src-shared/Interfaces';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { injectable, unmanaged } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ProjectDependentService<Type extends ProjectDependent> {
  constructor(
    @unmanaged() private readonly _clazz: { new (): Type },
    @unmanaged() private readonly _projectRepo: ProjectRepo,
    @unmanaged() private readonly _projectDependentRepo: Repository<Type>,
    @unmanaged() private readonly _lastIdRepo: ProjectEntityLastIdRepo
  ) {}

  public async create(obj: Type): Promise<Type> {
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    const nextId = await this.nextId(obj.projectId);
    return this.checkCreationRules(obj).then(() => this._projectDependentRepo.insert({ ...obj, id: nextId }));
  }

  private async checkCreationRules(obj: Type): Promise<void> {
    const projectExists = await this._projectRepo.exists(obj.projectId);
    if (!projectExists) throw new NAXTError('No such project exists:', obj);
  }

  private async nextId(projectId: string): Promise<number> {
    return this._lastIdRepo.nextId(projectId, this._clazz);
  }

  public async update(obj: Type): Promise<Type | null> {
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return await this._projectDependentRepo.update(obj);
  }

  public async remove(obj: Type): Promise<boolean> {
    const { projectId, id } = obj;
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return await this._projectDependentRepo._remove({ ...new this._clazz(), projectId, id });
  }

  public async get(projectId: string, id: number): Promise<Type | null> {
    return this._projectDependentRepo._find({ ...new this._clazz(), projectId, id });
  }

  public get$(projectId: string, id: number): Observable<Type | null> {
    return this._projectDependentRepo._find$({ ...new this._clazz(), projectId, id });
  }

  public async getAll(projectId: string): Promise<Type[]> {
    return this._projectDependentRepo.findAll(projectId);
  }

  public getAll$(projectId: string): Observable<Type[]> {
    return this._projectDependentRepo.findAll$(projectId);
  }
}
