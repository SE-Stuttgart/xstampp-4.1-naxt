import {
  SafetyManagementSystem,
  SafetyManagementSystemControllerLink,
  SafetyManagementSystemDescription,
} from '@cast/src/main/models';
import { SafetyManagementSystemControllerLinkService, SafetyManagementSystemService } from '@cast/src/main/services';
import { SafetyManagementSystemTableModel } from '@cast/src/main/services/models/table-models/step-4/SafetyManagementSystemTableModel';
import { SafetyManagementSystemDescriptionService } from '@cast/src/main/services/step-4/description-services/SafetyManagementSystemDescriptionService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class SafetyManagementSystemController {
  constructor(
    @inject(SafetyManagementSystemService)
    private readonly safetyManagementSystemService: SafetyManagementSystemService,
    @inject(SafetyManagementSystemDescriptionService)
    private readonly descriptionService: SafetyManagementSystemDescriptionService,
    @inject(SafetyManagementSystemControllerLinkService)
    private readonly linkService: SafetyManagementSystemControllerLinkService
  ) {}

  public async create(projectId: string): Promise<SafetyManagementSystem> {
    return this.safetyManagementSystemService.create({ ...new SafetyManagementSystem(), projectId });
  }

  public async update(changesAndDynamicsOverTime: SafetyManagementSystem): Promise<SafetyManagementSystem> {
    return this.safetyManagementSystemService.update(changesAndDynamicsOverTime);
  }

  public async remove(changesAndDynamicsOverTime: SafetyManagementSystem): Promise<boolean> {
    return this.safetyManagementSystemService.remove(changesAndDynamicsOverTime);
  }

  public getAll$(projectId: string): Observable<SafetyManagementSystemTableModel[]> {
    return this.safetyManagementSystemService.getAllTableModels$(projectId);
  }

  public async createControllerLink(
    link: SafetyManagementSystemControllerLink
  ): Promise<SafetyManagementSystemControllerLink> {
    await this.linkService.removeAllForSafetyManagementId(link.projectId, link.safetyManagementSystemId);
    return this.linkService.create(link);
  }

  public async removeControllerLink(link: SafetyManagementSystemControllerLink): Promise<boolean> {
    return this.linkService.remove(link);
  }

  public async updateDescription(
    description: SafetyManagementSystemDescription
  ): Promise<SafetyManagementSystemDescription> {
    return this.descriptionService.update(description);
  }

  public getDescription$(projectId: string): Observable<SafetyManagementSystemDescription> {
    return this.descriptionService.get$(projectId);
  }
}
