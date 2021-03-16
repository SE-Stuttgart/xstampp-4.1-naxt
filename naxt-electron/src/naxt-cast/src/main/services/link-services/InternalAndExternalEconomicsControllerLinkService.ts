import { InternalAndExternalEconomicsControllerLink } from '@cast/src/main/models';
import {
  ControllerRepo,
  InternalAndExternalEconomicsControllerLinkRepo,
  InternalAndExternalEconomicsRepo,
  ProjectRepo,
} from '@cast/src/main/repositories';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import { toControllerChipMapByInternalAndExternalEconomicsIds$ } from '@cast/src/main/services/util/toChipMap';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { inject } from 'inversify';
import { Observable } from 'rxjs';
import { LinkService } from '../common/LinkService';

export class InternalAndExternalEconomicsControllerLinkService extends LinkService<
  InternalAndExternalEconomicsControllerLink
> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(InternalAndExternalEconomicsControllerLinkRepo)
    private readonly linkRepo: InternalAndExternalEconomicsControllerLinkRepo,
    @inject(InternalAndExternalEconomicsRepo)
    private readonly internalAndExternalEconomicsRepo: InternalAndExternalEconomicsRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo
  ) {
    super(InternalAndExternalEconomicsControllerLink, projectRepo, linkRepo);
  }

  public async create(
    link: InternalAndExternalEconomicsControllerLink
  ): Promise<InternalAndExternalEconomicsControllerLink> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: InternalAndExternalEconomicsControllerLink): Promise<void> {
    const { projectId, internalAndExternalEconomicsId, controllerId } = link;

    const economicsExists = this.internalAndExternalEconomicsRepo.exists(projectId, internalAndExternalEconomicsId);
    if (!economicsExists) throw new NAXTError('No such [internal and external economics] exists:', link);

    const controllerExists = this.controllerRepo.exists(projectId, controllerId);
    if (!controllerExists) throw new NAXTError('No such [controller] exists:', link);
  }

  public getControllerChipMapByInternalAndExternalEconomicsIds$(projectId: string): Observable<ChipMap> {
    const controllers$ = this.controllerRepo.findAll$(projectId);
    const internalAndExternalEconomics$ = this.internalAndExternalEconomicsRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toControllerChipMapByInternalAndExternalEconomicsIds$(controllers$, internalAndExternalEconomics$, links$);
  }

  public async removeAllForInternalAndExternalEconomicsId(
    projectId: string,
    internalAndExternalEconomicsId: string
  ): Promise<InternalAndExternalEconomicsControllerLink[]> {
    return this.linkRepo.removeAllForInternalAndExternalEconomicsId(projectId, internalAndExternalEconomicsId);
  }
}
