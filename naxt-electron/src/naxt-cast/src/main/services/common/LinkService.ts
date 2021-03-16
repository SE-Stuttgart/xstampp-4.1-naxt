import { ProjectRepo } from '@cast/src/main/repositories';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { ProjectId } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class LinkService<Type extends ProjectId> {
  private readonly clazzName: string;

  protected constructor(
    @unmanaged() private readonly _clazz: { new (): Type },
    @unmanaged() private readonly _projectRepo: ProjectRepo,
    @unmanaged() private readonly _linkRepo: Repository<Type>
  ) {
    this.clazzName = _clazz.name;
  }

  public async create(obj: Type): Promise<Type> {
    const projectExists = await this.projectExists(obj.projectId);
    if (!projectExists) throw new NAXTError('No such [project] exists:', obj);
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return this._linkRepo.insert(obj);
  }

  private async projectExists(projectId: string): Promise<boolean> {
    return this._projectRepo._exists({ ...new Project(), projectId: projectId });
  }

  public async remove(obj: Type): Promise<boolean> {
    await this._projectRepo.setUnsavedChanges(obj.projectId, true);
    return await this._linkRepo._remove(obj);
  }

  public async getAll(projectId: string): Promise<Type[]> {
    return this._linkRepo.findAll(projectId);
  }

  public getAll$(projectId: string): Observable<Type[]> {
    return this._linkRepo.findAll$(projectId);
  }
}
