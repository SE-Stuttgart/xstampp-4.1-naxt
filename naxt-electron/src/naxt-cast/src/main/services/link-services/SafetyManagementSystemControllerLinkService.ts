import { SafetyManagementSystemControllerLink } from '@cast/src/main/models';
import {
  ControllerRepo,
  ProjectRepo,
  SafetyManagementSystemControllerLinkRepo,
  SafetyManagementSystemRepo,
} from '@cast/src/main/repositories';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import { toControllerChipMapBySafetyManagementSystemIds$ } from '@cast/src/main/services/util/toChipMap';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { LinkService } from '../common/LinkService';

@injectable()
export class SafetyManagementSystemControllerLinkService extends LinkService<SafetyManagementSystemControllerLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SafetyManagementSystemControllerLinkRepo)
    private readonly linkRepo: SafetyManagementSystemControllerLinkRepo,
    @inject(SafetyManagementSystemRepo) private readonly safetyManagementSystemRepo: SafetyManagementSystemRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo
  ) {
    super(SafetyManagementSystemControllerLink, projectRepo, linkRepo);
  }

  public async create(link: SafetyManagementSystemControllerLink): Promise<SafetyManagementSystemControllerLink> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: SafetyManagementSystemControllerLink): Promise<void> {
    const { projectId, safetyManagementSystemId, controllerId } = link;

    const safetyManagementSystemExists = this.safetyManagementSystemRepo.exists(projectId, safetyManagementSystemId);
    if (!safetyManagementSystemExists) throw new NAXTError('No such [safety management system] exists:', link);

    const controllerExists = this.controllerRepo.exists(projectId, controllerId);
    if (!controllerExists) throw new NAXTError('No such [controller] exists:', link);
  }

  public getControllerChipMapBySafetyManagementSystemIds$(projectId: string): Observable<ChipMap> {
    const controllers$ = this.controllerRepo.findAll$(projectId);
    const safetyManagementSystems$ = this.safetyManagementSystemRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toControllerChipMapBySafetyManagementSystemIds$(controllers$, safetyManagementSystems$, links$);
  }

  public async removeAllForSafetyManagementId(
    projectId: string,
    safetyManagementSystemId: string
  ): Promise<SafetyManagementSystemControllerLink[]> {
    return this.linkRepo.removeAllForSafetyManagementId(projectId, safetyManagementSystemId);
  }
}
