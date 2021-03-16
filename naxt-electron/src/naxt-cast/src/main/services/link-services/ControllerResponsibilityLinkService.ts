import { ControllerResponsibilityLink } from '@cast/src/main/models';
import {
  ControllerRepo,
  ControllerResponsibilityLinkRepo,
  ProjectRepo,
  ResponsibilityRepo,
} from '@cast/src/main/repositories';
import { LinkService } from '@cast/src/main/services/common/LinkService';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import { toControllerChipMapByResponsibilityIds$ } from '@cast/src/main/services/util/toChipMap';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ControllerResponsibilityLinkService extends LinkService<ControllerResponsibilityLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ControllerResponsibilityLinkRepo)
    private readonly controllerResponsibilityLinkRepo: ControllerResponsibilityLinkRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo,
    @inject(ResponsibilityRepo) private readonly responsibilityRepo: ResponsibilityRepo
  ) {
    super(ControllerResponsibilityLink, projectRepo, controllerResponsibilityLinkRepo);
  }

  public async create(link: ControllerResponsibilityLink): Promise<ControllerResponsibilityLink> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: ControllerResponsibilityLink): Promise<void> {
    const { projectId, responsibilityId, controllerId } = link;

    const responsibilityExists = this.responsibilityRepo.exists(projectId, responsibilityId);
    if (!responsibilityExists) throw new NAXTError('No such [responsibility] exists:', link);

    const controllerExists = this.controllerRepo.exists(projectId, controllerId);
    if (!controllerExists) throw new NAXTError('No such [controller] exists:', link);
  }

  public getControllerChipMapByHazardIds$(projectId: string): Observable<ChipMap> {
    const controller$ = this.controllerRepo.findAll$(projectId);
    const responsibilities$ = this.responsibilityRepo.findAll$(projectId);
    const links$ = this.controllerResponsibilityLinkRepo.findAll$(projectId);
    return toControllerChipMapByResponsibilityIds$(controller$, responsibilities$, links$);
  }

  public async removeAllForResponsibilityId(
    projectId: string,
    responsibilityId: string
  ): Promise<ControllerResponsibilityLink[]> {
    return this.controllerResponsibilityLinkRepo.removeAllForResponsibilityId(projectId, responsibilityId);
  }
}
