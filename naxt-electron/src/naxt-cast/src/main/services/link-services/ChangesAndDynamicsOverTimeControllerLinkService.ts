import { ChangesAndDynamicsOverTimeControllerLink } from '@cast/src/main/models';
import {
  ChangesAndDynamicsOverTimeControllerLinkRepo,
  ChangesAndDynamicsOverTimeRepo,
  ControllerRepo,
  ProjectRepo,
} from '@cast/src/main/repositories';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import { toControllerChipMapByChangesAndDynamicOverTimeIds$ } from '@cast/src/main/services/util/toChipMap';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { inject } from 'inversify';
import { Observable } from 'rxjs';
import { LinkService } from '../common/LinkService';

export class ChangesAndDynamicsOverTimeControllerLinkService extends LinkService<
  ChangesAndDynamicsOverTimeControllerLink
> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ChangesAndDynamicsOverTimeControllerLinkRepo)
    private readonly linkRepo: ChangesAndDynamicsOverTimeControllerLinkRepo,
    @inject(ChangesAndDynamicsOverTimeRepo)
    private readonly changesAndDynamicsOverTimeRepo: ChangesAndDynamicsOverTimeRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo
  ) {
    super(ChangesAndDynamicsOverTimeControllerLink, projectRepo, linkRepo);
  }

  public async create(
    link: ChangesAndDynamicsOverTimeControllerLink
  ): Promise<ChangesAndDynamicsOverTimeControllerLink> {
    await this.linkRepo
      .findAllByChangesAndDynamicsOverTimeId(link.projectId, link.changesAndDynamicsOverTimeId)
      .then(links => links.forEach(this.linkRepo._remove));
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  public async removeAllForChangesAndDynamicsOverTimeId(
    projectId: string,
    changesAndDynamicsOverTimeId: string
  ): Promise<ChangesAndDynamicsOverTimeControllerLink[]> {
    return this.linkRepo.removeAllForChangesAndDynamicsOverTimeId(projectId, changesAndDynamicsOverTimeId);
  }

  private async checkCreationRules(link: ChangesAndDynamicsOverTimeControllerLink): Promise<void> {
    const { projectId, changesAndDynamicsOverTimeId, controllerId } = link;

    const cdOverTimeExists = this.changesAndDynamicsOverTimeRepo.exists(projectId, changesAndDynamicsOverTimeId);
    if (!cdOverTimeExists) throw new NAXTError('No such [changes/dynamics over time] exists:', link);

    const controllerExists = this.controllerRepo.exists(projectId, controllerId);
    if (!controllerExists) throw new NAXTError('No such [controller] exists:', link);

    const links = await this.linkRepo.findAllByChangesAndDynamicsOverTimeId(projectId, changesAndDynamicsOverTimeId);
    if (links.length >= 2) throw new NAXTError('Only two [controllers] can be linked:', link);
  }

  public getControllerChipMapByChangesAndDynamicOverTimeIds$(projectId: string): Observable<ChipMap> {
    const controllers$ = this.controllerRepo.findAll$(projectId);
    const changesAndDynamicsOverTimes$ = this.changesAndDynamicsOverTimeRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toControllerChipMapByChangesAndDynamicOverTimeIds$(controllers$, changesAndDynamicsOverTimes$, links$);
  }
}
