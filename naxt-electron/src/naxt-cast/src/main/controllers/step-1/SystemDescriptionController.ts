import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { SystemDescription } from '../../models';
import { SystemDescriptionService } from '../../services';

@injectable()
export class SystemDescriptionController {
  constructor(@inject(SystemDescriptionService) private readonly systemDescriptionService: SystemDescriptionService) {}

  public async update(systemDescription: SystemDescription): Promise<SystemDescription> {
    return this.systemDescriptionService.update(systemDescription);
  }

  public async get(projectId: string): Promise<SystemDescription | null> {
    return this.systemDescriptionService.get(projectId);
  }

  public get$(projectId: string): Observable<SystemDescription> {
    return this.systemDescriptionService.get$(projectId);
  }
}
