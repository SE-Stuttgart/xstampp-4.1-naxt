import { LinkedDocuments, SystemDescription } from '@stpa/src/main/models';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { SystemDescriptionService } from '../services';

@injectable()
export class SystemDescriptionController {
  constructor(@inject(SystemDescriptionService) private readonly systemDescriptionService: SystemDescriptionService) {}

  public async update(systemDescription: SystemDescription): Promise<SystemDescription> {
    return this.systemDescriptionService.update(systemDescription);
  }

  public async get(projectId: string): Promise<(SystemDescription & LinkedDocuments) | null> {
    return this.systemDescriptionService.get(projectId);
  }

  public get$(projectId: string): Observable<SystemDescription & LinkedDocuments> {
    return this.systemDescriptionService.get$(projectId);
  }
}
