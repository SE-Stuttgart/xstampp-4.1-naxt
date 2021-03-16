import { SafetyCulture, SafetyCultureControllerLink, SafetyCultureDescription } from '@cast/src/main/models';
import { SafetyCultureControllerLinkService, SafetyCultureService } from '@cast/src/main/services';
import { SafetyCultureTableModel } from '@cast/src/main/services/models/table-models/step-4/SafetyCultureTableModel';
import { SafetyCultureDescriptionService } from '@cast/src/main/services/step-4/description-services/SafetyCultureDescriptionService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class SafetyCultureController {
  constructor(
    @inject(SafetyCultureService)
    private readonly safetyCultureService: SafetyCultureService,
    @inject(SafetyCultureDescriptionService)
    private readonly descriptionService: SafetyCultureDescriptionService,
    @inject(SafetyCultureControllerLinkService) private readonly linkService: SafetyCultureControllerLinkService
  ) {}

  public async create(projectId: string): Promise<SafetyCulture> {
    return this.safetyCultureService.create({ ...new SafetyCulture(), projectId });
  }

  public async update(safetyCulture: SafetyCulture): Promise<SafetyCulture> {
    return this.safetyCultureService.update(safetyCulture);
  }

  public async remove(safetyCulture: SafetyCulture): Promise<boolean> {
    return this.safetyCultureService.remove(safetyCulture);
  }

  public getAll$(projectId: string): Observable<SafetyCultureTableModel[]> {
    return this.safetyCultureService.getAllTableModels$(projectId);
  }

  public async createControllerLink(link: SafetyCultureControllerLink): Promise<SafetyCultureControllerLink> {
    await this.linkService.removeAllForSafetyCultureId(link.projectId, link.safetyCultureId);
    return this.linkService.create(link);
  }

  public async removeControllerLink(link: SafetyCultureControllerLink): Promise<boolean> {
    return this.linkService.remove(link);
  }

  public async updateDescription(description: SafetyCultureDescription): Promise<SafetyCultureDescription> {
    return this.descriptionService.update(description);
  }

  public getDescription$(projectId: string): Observable<SafetyCultureDescription> {
    return this.descriptionService.get$(projectId);
  }
}
