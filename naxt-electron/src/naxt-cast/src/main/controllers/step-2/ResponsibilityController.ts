import { ConstraintResponsibilityLink, ControllerResponsibilityLink, Responsibility } from '@cast/src/main/models';
import {
  ConstraintResponsibilityLinkService,
  ControllerResponsibilityLinkService,
  ResponsibilityService,
} from '@cast/src/main/services';
import { ResponsibilityTableModel } from '@cast/src/main/services/models/table-models/step-2/ResponsibilityTableModel';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ResponsibilityController {
  constructor(
    @inject(ResponsibilityService) private readonly responsibilityService: ResponsibilityService,
    @inject(ConstraintResponsibilityLinkService)
    private readonly constraintResponsibilityLinkService: ConstraintResponsibilityLinkService,
    @inject(ControllerResponsibilityLinkService)
    private readonly controllerResponsibilityLinkService: ControllerResponsibilityLinkService
  ) {}

  public async create(projectId: string): Promise<Responsibility> {
    return this.responsibilityService.create({ ...new Responsibility(), projectId });
  }

  public getAll$(projectId: string): Observable<ResponsibilityTableModel[]> {
    return this.responsibilityService.getAllTableModels$(projectId);
  }

  public async update(responsibility: Responsibility): Promise<Responsibility> {
    return this.responsibilityService.update(responsibility);
  }

  public async remove(responsibility: Responsibility): Promise<boolean> {
    return this.responsibilityService.remove(responsibility);
  }

  public async createControllerLink(link: ControllerResponsibilityLink): Promise<ControllerResponsibilityLink> {
    await this.controllerResponsibilityLinkService.removeAllForResponsibilityId(link.projectId, link.responsibilityId);
    return this.controllerResponsibilityLinkService.create(link);
  }

  public async removeControllerLink(link: ControllerResponsibilityLink): Promise<boolean> {
    return this.controllerResponsibilityLinkService.remove(link);
  }

  public async createConstraintLink(link: ConstraintResponsibilityLink): Promise<ConstraintResponsibilityLink> {
    return this.constraintResponsibilityLinkService.create(link);
  }

  public async removeConstraintLink(link: ConstraintResponsibilityLink): Promise<boolean> {
    return this.constraintResponsibilityLinkService.remove(link);
  }
}
