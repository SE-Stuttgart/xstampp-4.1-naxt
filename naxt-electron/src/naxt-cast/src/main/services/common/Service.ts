import { LastIdRepo, ProjectRepo } from '@cast/src/main/repositories';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { IdString, Label, ProjectId } from '@src-shared/Interfaces';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';
import { Observable } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';

@injectable()
export class Service<Type extends ProjectId & IdString & Label> {
  private readonly clazzName: string;

  protected constructor(
    @unmanaged() private readonly _clazz: { new (): Type },
    @unmanaged() private readonly _projectRepo: ProjectRepo,
    @unmanaged() private readonly _modelRepo: Repository<Type>,
    @unmanaged() private readonly _lastIdRepo: LastIdRepo
  ) {
    this.clazzName = _clazz.name;
  }

  public async create(obj: Type): Promise<Type> {
    const projectExists = await this.projectExists(obj.projectId);
    if (!projectExists) throw new NAXTError('No such [project] exists:', obj);
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);

    const nextId = await this._lastIdRepo.nextId(obj.projectId, this._clazz);
    return this._modelRepo.insert({ ...obj, id: uuidV4(), label: String(nextId) });
  }

  private async projectExists(projectId: string): Promise<boolean> {
    return this._projectRepo.exists(projectId);
  }

  public async update(obj: Type): Promise<Type | null> {
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return await this._modelRepo.update(obj);
  }

  public async remove(obj: Type): Promise<boolean> {
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return await this._modelRepo._remove(obj);
  }

  public async exists(projectId: string, id: string): Promise<boolean> {
    return await this._modelRepo._exists({ ...new this._clazz(), projectId: projectId, id: id });
  }

  public async get(projectId: string, id: string): Promise<Type | null> {
    return this._modelRepo._find({ ...new this._clazz(), projectId: projectId, id: id });
  }

  public get$(projectId: string, id: string): Observable<Type | null> {
    return this._modelRepo._find$({ ...new this._clazz(), projectId: projectId, id: id });
  }

  public async getAll(projectId: string): Promise<Type[]> {
    return this._modelRepo.findAll(projectId);
  }

  public getAll$(projectId: string): Observable<Type[]> {
    return this._modelRepo.findAll$(projectId);
  }
}
