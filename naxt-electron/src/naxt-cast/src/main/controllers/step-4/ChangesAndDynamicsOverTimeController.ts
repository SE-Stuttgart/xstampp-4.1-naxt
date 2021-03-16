import {
  ChangesAndDynamicsOverTime,
  ChangesAndDynamicsOverTimeControllerLink,
  ChangesAndDynamicsOverTimeDescription,
} from '@cast/src/main/models';
import {
  ChangesAndDynamicsOverTimeControllerLinkService,
  ChangesAndDynamicsOverTimeService,
} from '@cast/src/main/services';
import { ChangesAndDynamicsOverTimeTableModel } from '@cast/src/main/services/models/table-models/step-4/ChangesAndDynamicsOverTimeTableModel';
import { ChangesAndDynamicsOverTimeDescriptionService } from '@cast/src/main/services/step-4/description-services/ChangesAndDynamicsOverTimeDescriptionService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ChangesAndDynamicsOverTimeController {
  constructor(
    @inject(ChangesAndDynamicsOverTimeService)
    private readonly changesAndDynamicsOverTimeService: ChangesAndDynamicsOverTimeService,
    @inject(ChangesAndDynamicsOverTimeDescriptionService)
    private readonly descriptionService: ChangesAndDynamicsOverTimeDescriptionService,
    @inject(ChangesAndDynamicsOverTimeControllerLinkService)
    private readonly linkService: ChangesAndDynamicsOverTimeControllerLinkService
  ) {}

  public async create(projectId: string): Promise<ChangesAndDynamicsOverTime> {
    return this.changesAndDynamicsOverTimeService.create({ ...new ChangesAndDynamicsOverTime(), projectId });
  }

  public async update(changesAndDynamicsOverTime: ChangesAndDynamicsOverTime): Promise<ChangesAndDynamicsOverTime> {
    return this.changesAndDynamicsOverTimeService.update(changesAndDynamicsOverTime);
  }

  public async remove(changesAndDynamicsOverTime: ChangesAndDynamicsOverTime): Promise<boolean> {
    return this.changesAndDynamicsOverTimeService.remove(changesAndDynamicsOverTime);
  }

  public getAll$(projectId: string): Observable<ChangesAndDynamicsOverTimeTableModel[]> {
    return this.changesAndDynamicsOverTimeService.getAllTableModels$(projectId);
  }

  public async createControllerLink(
    link: ChangesAndDynamicsOverTimeControllerLink
  ): Promise<ChangesAndDynamicsOverTimeControllerLink> {
    await this.linkService.removeAllForChangesAndDynamicsOverTimeId(link.projectId, link.changesAndDynamicsOverTimeId);
    return this.linkService.create(link);
  }

  public async removeControllerLink(link: ChangesAndDynamicsOverTimeControllerLink): Promise<boolean> {
    return this.linkService.remove(link);
  }

  public async updateDescription(
    description: ChangesAndDynamicsOverTimeDescription
  ): Promise<ChangesAndDynamicsOverTimeDescription> {
    return this.descriptionService.update(description);
  }

  public getDescription$(projectId: string): Observable<ChangesAndDynamicsOverTimeDescription> {
    return this.descriptionService.get$(projectId);
  }
}
