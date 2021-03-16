import {
  InternalAndExternalEconomics,
  InternalAndExternalEconomicsControllerLink,
  InternalAndExternalEconomicsDescription,
} from '@cast/src/main/models';
import {
  InternalAndExternalEconomicsControllerLinkService,
  InternalAndExternalEconomicsService,
} from '@cast/src/main/services';
import { InternalAndExternalEconomicsTableModel } from '@cast/src/main/services/models/table-models/step-4/InternalAndExternalEconomicsTableModel';
import { InternalAndExternalEconomicsDescriptionService } from '@cast/src/main/services/step-4/description-services/InternalAndExternalEconomicsDescriptionService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class InternalAndExternalEconomicsController {
  constructor(
    @inject(InternalAndExternalEconomicsService)
    private readonly internalAndExternalEconomicsService: InternalAndExternalEconomicsService,
    @inject(InternalAndExternalEconomicsDescriptionService)
    private readonly descriptionService: InternalAndExternalEconomicsDescriptionService,
    @inject(InternalAndExternalEconomicsControllerLinkService)
    private readonly linkService: InternalAndExternalEconomicsControllerLinkService
  ) {}

  public async create(projectId: string): Promise<InternalAndExternalEconomics> {
    return this.internalAndExternalEconomicsService.create({ ...new InternalAndExternalEconomics(), projectId });
  }

  public async update(
    internalAndExternalEconomics: InternalAndExternalEconomics
  ): Promise<InternalAndExternalEconomics> {
    return this.internalAndExternalEconomicsService.update(internalAndExternalEconomics);
  }

  public async remove(internalAndExternalEconomics: InternalAndExternalEconomics): Promise<boolean> {
    return this.internalAndExternalEconomicsService.remove(internalAndExternalEconomics);
  }

  public getAll$(projectId: string): Observable<InternalAndExternalEconomicsTableModel[]> {
    return this.internalAndExternalEconomicsService.getAllTableModels$(projectId);
  }

  public async createControllerLink(
    link: InternalAndExternalEconomicsControllerLink
  ): Promise<InternalAndExternalEconomicsControllerLink> {
    await this.linkService.removeAllForInternalAndExternalEconomicsId(
      link.projectId,
      link.internalAndExternalEconomicsId
    );
    return this.linkService.create(link);
  }

  public async removeControllerLink(link: InternalAndExternalEconomicsControllerLink): Promise<boolean> {
    return this.linkService.remove(link);
  }

  public async updateDescription(
    description: InternalAndExternalEconomicsDescription
  ): Promise<InternalAndExternalEconomicsDescription> {
    return this.descriptionService.update(description);
  }

  public getDescription$(projectId: string): Observable<InternalAndExternalEconomicsDescription> {
    return this.descriptionService.get$(projectId);
  }
}
