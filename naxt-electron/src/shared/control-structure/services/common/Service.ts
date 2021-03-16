import { NAXTError } from '@src-shared/errors/NaxtError';
import { Id, NextId, ProjectId, UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class Service<Type extends ProjectId & Id> {
  private readonly clazzName: string;

  constructor(
    @unmanaged()
    private readonly _clazz: { new (): Type },
    @unmanaged()
    private readonly _projectRepo: Repository<Project> & UnchangedSavesSetter,
    @unmanaged()
    private readonly _modelRepo: Repository<Type>,
    @unmanaged()
    private readonly lastIdRepo: NextId<Type>
  ) {
    this.clazzName = _clazz.name;
  }

  public async create(obj: Type): Promise<Type> {
    const projectExists = await this.projectExists(obj.projectId);
    if (!projectExists) throw new NAXTError('No such project exists:', obj);

    const nextId = await this.nextId(obj.projectId);
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return this._modelRepo.insert({ ...obj, id: nextId });
  }

  private async projectExists(projectId: string): Promise<boolean> {
    return this._projectRepo._exists({ ...new Project(), projectId });
  }

  private async nextId(projectId: string): Promise<number> {
    return this.lastIdRepo.nextId(projectId, this._clazz);
  }

  public async update(obj: Type): Promise<Type | null> {
    const projectExists = await this.projectExists(obj.projectId);
    if (!projectExists) throw new NAXTError('No such project exists:', obj);

    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return await this._modelRepo.update(obj);
  }

  public async remove(obj: Type): Promise<boolean> {
    const { projectId, id } = obj;

    const projectExists = await this.projectExists(projectId);
    if (!projectExists) throw new NAXTError('No such project exists:', obj);

    await this._projectRepo.setUnsavedChanges(projectId, true);
    return await this._modelRepo._remove({ ...new this._clazz(), projectId, id });
  }

  public async get(projectId: string, id: number): Promise<Type | null> {
    return this._modelRepo._find({ ...new this._clazz(), projectId, id });
  }

  public get$(projectId: string, id: number): Observable<Type | null> {
    return this._modelRepo._find$({ ...new this._clazz(), projectId, id });
  }

  public async getAll(projectId: string): Promise<Type[]> {
    return this._modelRepo.findAll(projectId);
  }

  public getAll$(projectId: string): Observable<Type[]> {
    return this._modelRepo.findAll$(projectId);
  }
}
