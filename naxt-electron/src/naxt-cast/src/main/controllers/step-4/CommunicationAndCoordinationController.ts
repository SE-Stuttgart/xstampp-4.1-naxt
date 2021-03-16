import {
  CommunicationAndCoordination,
  CommunicationAndCoordinationController1Link,
  CommunicationAndCoordinationDescription,
} from '@cast/src/main/models';
import {
  CommunicationAndCoordinationController1LinkService,
  CommunicationAndCoordinationController2LinkService,
  CommunicationAndCoordinationService,
} from '@cast/src/main/services';
import { CommunicationAndCoordinationTableModel } from '@cast/src/main/services/models/table-models/step-4/CommunicationAndCoordinationTableModel';
import { CommunicationAndCoordinationDescriptionService } from '@cast/src/main/services/step-4/description-services/CommunicationAndCoordinationDescriptionService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class CommunicationAndCoordinationController {
  constructor(
    @inject(CommunicationAndCoordinationService)
    private readonly communicationAndCoordinationService: CommunicationAndCoordinationService,
    @inject(CommunicationAndCoordinationDescriptionService)
    private readonly descriptionService: CommunicationAndCoordinationDescriptionService,
    @inject(CommunicationAndCoordinationController1LinkService)
    private readonly linkService1: CommunicationAndCoordinationController1LinkService,
    @inject(CommunicationAndCoordinationController2LinkService)
    private readonly linkService2: CommunicationAndCoordinationController2LinkService
  ) {}

  public async create(projectId: string): Promise<CommunicationAndCoordination> {
    return this.communicationAndCoordinationService.create({ ...new CommunicationAndCoordination(), projectId });
  }

  public async update(
    communicationAndCoordinationService: CommunicationAndCoordination
  ): Promise<CommunicationAndCoordination> {
    return this.communicationAndCoordinationService.update(communicationAndCoordinationService);
  }

  public async remove(communicationAndCoordinationService: CommunicationAndCoordination): Promise<boolean> {
    return this.communicationAndCoordinationService.remove(communicationAndCoordinationService);
  }

  public getAll$(projectId: string): Observable<CommunicationAndCoordinationTableModel[]> {
    return this.communicationAndCoordinationService.getAllTableModels$(projectId);
  }

  public async createController1Link(
    link: CommunicationAndCoordinationController1Link
  ): Promise<CommunicationAndCoordinationController1Link> {
    await this.linkService1.removeAllForCommunicationAndCoordinationId(
      link.projectId,
      link.communicationAndCoordinationId
    );
    return this.linkService1.create(link);
  }

  public async removeController1Link(link: CommunicationAndCoordinationController1Link): Promise<boolean> {
    return this.linkService1.remove(link);
  }

  public async createController2Link(
    link: CommunicationAndCoordinationController1Link
  ): Promise<CommunicationAndCoordinationController1Link> {
    await this.linkService2.removeAllForCommunicationAndCoordinationId(
      link.projectId,
      link.communicationAndCoordinationId
    );
    return this.linkService2.create(link);
  }

  public async removeController2Link(link: CommunicationAndCoordinationController1Link): Promise<boolean> {
    return this.linkService2.remove(link);
  }

  public async updateDescription(
    description: CommunicationAndCoordinationDescription
  ): Promise<CommunicationAndCoordinationDescription> {
    return this.descriptionService.update(description);
  }

  public getDescription$(projectId: string): Observable<CommunicationAndCoordinationDescription> {
    return this.descriptionService.get$(projectId);
  }
}
