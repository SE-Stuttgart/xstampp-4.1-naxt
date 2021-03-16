import { NAXTError } from '@src-shared/errors/NaxtError';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LinkedDocuments, SystemDescription } from '../models';
import { LinkedDocumentsRepo, ProjectRepo, SystemDescriptionRepo } from '../repositories';
import { ProjectIdService } from './common/ProjectIdService';

@injectable()
export class SystemDescriptionService extends ProjectIdService<SystemDescription> {
  constructor(
    @inject(ProjectRepo) private readonly projectRepo: ProjectRepo,
    @inject(SystemDescriptionRepo) private readonly systemDescriptionRepo: SystemDescriptionRepo,
    @inject(LinkedDocumentsRepo) private readonly linkedDocumentsRepo: LinkedDocumentsRepo
  ) {
    super(SystemDescription, projectRepo, systemDescriptionRepo);
  }

  public async create(systemDescription: SystemDescription): Promise<SystemDescription> {
    return this._checkCreationRules(systemDescription).then(() => this.systemDescriptionRepo.insert(systemDescription));
  }

  private async _checkCreationRules(systemDescription: SystemDescription): Promise<void> {
    const projectExists = await this.projectRepo.exists(systemDescription.projectId);
    if (!projectExists) throw new NAXTError('No such [project] exists:', systemDescription);
  }

  get$(projectId: string): Observable<(SystemDescription & LinkedDocuments) | null> {
    return combineLatest([super.get$(projectId), this.linkedDocumentsRepo.find$(projectId)]).pipe(
      map(([systemDescription, linkedDocuments]) => {
        return {
          projectId: systemDescription.projectId,
          description: systemDescription.description,
          linkedDocuments: linkedDocuments.linkedDocuments,
        };
      })
    );
  }

  async get(projectId: string): Promise<(SystemDescription & LinkedDocuments) | null> {
    const systemDescription = await super.get(projectId);
    const linkedDocuments = await this.linkedDocumentsRepo.find(projectId);
    return {
      projectId: systemDescription.projectId,
      description: systemDescription.description,
      linkedDocuments: linkedDocuments.linkedDocuments,
    };
  }
}
