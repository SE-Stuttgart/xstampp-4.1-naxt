import { SafetyInformationSystemControllerLink } from '@cast/src/main/models';
import {
  ControllerRepo,
  ProjectRepo,
  SafetyInformationSystemControllerLinkRepo,
  SafetyInformationSystemRepo,
} from '@cast/src/main/repositories';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import { toControllerChipMapBySafetyInformationSystemIds$ } from '@cast/src/main/services/util/toChipMap';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { inject } from 'inversify';
import { Observable } from 'rxjs';
import { LinkService } from '../common/LinkService';

export class SafetyInformationSystemControllerLinkService extends LinkService<SafetyInformationSystemControllerLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SafetyInformationSystemControllerLinkRepo)
    private readonly linkRepo: SafetyInformationSystemControllerLinkRepo,
    @inject(SafetyInformationSystemRepo)
    private readonly safetyInformationSystemRepo: SafetyInformationSystemRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo
  ) {
    super(SafetyInformationSystemControllerLink, projectRepo, linkRepo);
  }

  public async create(link: SafetyInformationSystemControllerLink): Promise<SafetyInformationSystemControllerLink> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: SafetyInformationSystemControllerLink): Promise<void> {
    const { projectId, safetyInformationSystemId, controllerId } = link;

    const safetyInformationSystemExists = this.safetyInformationSystemRepo.exists(projectId, safetyInformationSystemId);
    if (!safetyInformationSystemExists) throw new NAXTError('No such [safety information system] exists:', link);

    const controllerExists = this.controllerRepo.exists(projectId, controllerId);
    if (!controllerExists) throw new NAXTError('No such [controller] exists:', link);
  }

  public getControllerChipMapBySafetyInformationSystemIds$(projectId: string): Observable<ChipMap> {
    const controllers$ = this.controllerRepo.findAll$(projectId);
    const safetyInformationSystems$ = this.safetyInformationSystemRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toControllerChipMapBySafetyInformationSystemIds$(controllers$, safetyInformationSystems$, links$);
  }

  public async removeAllForSafetyInformationId(
    projectId: string,
    safetyInformationSystemId: string
  ): Promise<SafetyInformationSystemControllerLink[]> {
    return this.linkRepo.removeAllForSafetyInformationId(projectId, safetyInformationSystemId);
  }
}
