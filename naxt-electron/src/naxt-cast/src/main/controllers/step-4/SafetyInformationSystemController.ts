import {
  SafetyInformationSystem,
  SafetyInformationSystemControllerLink,
  SafetyInformationSystemDescription,
} from '@cast/src/main/models';
import { SafetyInformationSystemControllerLinkService, SafetyInformationSystemService } from '@cast/src/main/services';
import { SafetyInformationSystemTableModel } from '@cast/src/main/services/models/table-models/step-4/SafetyInformationSystemTableModel';
import { SafetyInformationSystemDescriptionService } from '@cast/src/main/services/step-4/description-services/SafetyInformationSystemDescriptionService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class SafetyInformationSystemController {
  constructor(
    @inject(SafetyInformationSystemService)
    private readonly safetyInformationSystemService: SafetyInformationSystemService,
    @inject(SafetyInformationSystemDescriptionService)
    private readonly descriptionService: SafetyInformationSystemDescriptionService,
    @inject(SafetyInformationSystemControllerLinkService)
    private readonly linkService: SafetyInformationSystemControllerLinkService
  ) {}

  public async create(projectId: string): Promise<SafetyInformationSystem> {
    return this.safetyInformationSystemService.create({ ...new SafetyInformationSystem(), projectId });
  }

  public async update(safetyInformationSystem: SafetyInformationSystem): Promise<SafetyInformationSystem> {
    return this.safetyInformationSystemService.update(safetyInformationSystem);
  }

  public async remove(safetyInformationSystem: SafetyInformationSystem): Promise<boolean> {
    return this.safetyInformationSystemService.remove(safetyInformationSystem);
  }

  public getAll$(projectId: string): Observable<SafetyInformationSystemTableModel[]> {
    return this.safetyInformationSystemService.getAllTableModels$(projectId);
  }

  public async createControllerLink(
    link: SafetyInformationSystemControllerLink
  ): Promise<SafetyInformationSystemControllerLink> {
    await this.linkService.removeAllForSafetyInformationId(link.projectId, link.safetyInformationSystemId);
    return this.linkService.create(link);
  }

  public async removeControllerLink(link: SafetyInformationSystemControllerLink): Promise<boolean> {
    return this.linkService.remove(link);
  }

  public async updateDescription(
    description: SafetyInformationSystemDescription
  ): Promise<SafetyInformationSystemDescription> {
    return this.descriptionService.update(description);
  }

  public getDescription$(projectId: string): Observable<SafetyInformationSystemDescription> {
    return this.descriptionService.get$(projectId);
  }
}
