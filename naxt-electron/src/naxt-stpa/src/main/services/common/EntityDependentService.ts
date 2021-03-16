import { NAXTError } from '@src-shared/errors/NaxtError';
import { EntityDependent, LastId, ProjectDependent } from '@src-shared/Interfaces';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ProjectRepo } from '@stpa/src/main/repositories';
import { injectable, unmanaged } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class EntityDependentService<
  Type extends EntityDependent,
  ParentType extends ProjectDependent,
  LastIdType extends LastId
> {
  constructor(
    @unmanaged() private readonly _clazz: { new (): Type },
    @unmanaged() private readonly _projectRepo: ProjectRepo,
    @unmanaged() private readonly _parentRepo: { exists: (projectId: string, parentId: number) => Promise<boolean> },
    @unmanaged() private readonly _entityRepo: Repository<Type>,
    @unmanaged() private readonly _lastIdRepo: { nextId: (projectId: string, parentId: number) => Promise<number> }
  ) {}

  public async create(obj: Type): Promise<Type> {
    const { projectId, parentId } = obj;
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    const nextId = await this.nextId(projectId, parentId);
    return this.checkCreationRules(obj).then(() => this._entityRepo.insert({ ...obj, id: nextId }));
  }

  private async checkCreationRules(obj: Type): Promise<void> {
    const { projectId, parentId } = obj;

    const projectExists = await this._projectRepo.exists(projectId);
    if (!projectExists) throw new NAXTError('No such project exists:', obj);

    const parentExists = await this._parentRepo.exists(projectId, parentId);
    if (!parentExists) throw new NAXTError('No such parent exists:', obj);
  }

  private async nextId(projectId: string, parentId: number): Promise<number> {
    return this._lastIdRepo.nextId(projectId, parentId);
  }

  public async update(obj: Type): Promise<Type | null> {
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return this._entityRepo.update(obj);
  }

  public async remove(obj: Type): Promise<boolean> {
    const { projectId, parentId, id } = obj;
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return await this._entityRepo._remove({ ...new this._clazz(), projectId, parentId, id });
  }

  public async get(projectId: string, parentId: number, id: number): Promise<Type | null> {
    return this._entityRepo._find({ ...new this._clazz(), projectId, parentId, id });
  }

  public get$(projectId: string, parentId: number, id: number): Observable<Type | null> {
    return this._entityRepo._find$({ ...new this._clazz(), projectId, parentId, id });
  }

  public async getAll(projectId: string): Promise<Type[]> {
    return this._entityRepo.findAll(projectId);
  }

  public getAll$(projectId: string): Observable<Type[]> {
    return this._entityRepo.findAll$(projectId);
  }
}
