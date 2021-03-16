import { SafetyCultureControllerLink } from '@cast/src/main/models';
import {
  ControllerRepo,
  ProjectRepo,
  SafetyCultureControllerLinkRepo,
  SafetyCultureRepo,
} from '@cast/src/main/repositories';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import { toControllerChipMapBySafetyCultureIds$ } from '@cast/src/main/services/util/toChipMap';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { inject } from 'inversify';
import { Observable } from 'rxjs';
import { LinkService } from '../common/LinkService';

export class SafetyCultureControllerLinkService extends LinkService<SafetyCultureControllerLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SafetyCultureControllerLinkRepo)
    private readonly linkRepo: SafetyCultureControllerLinkRepo,
    @inject(SafetyCultureRepo) private readonly safetyCultureRepo: SafetyCultureRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo
  ) {
    super(SafetyCultureControllerLink, projectRepo, linkRepo);
  }

  public async create(link: SafetyCultureControllerLink): Promise<SafetyCultureControllerLink> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: SafetyCultureControllerLink): Promise<void> {
    const { projectId, safetyCultureId, controllerId } = link;

    const safetyCultureExists = this.safetyCultureRepo.exists(projectId, safetyCultureId);
    if (!safetyCultureExists) throw new NAXTError('No such [safety culture] exists:', link);

    const controllerExists = this.controllerRepo.exists(projectId, controllerId);
    if (!controllerExists) throw new NAXTError('No such [controller] exists:', link);
  }

  public getControllerChipMapBySafetyCultureIds$(projectId: string): Observable<ChipMap> {
    const controllers$ = this.controllerRepo.findAll$(projectId);
    const safetyCultures$ = this.safetyCultureRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toControllerChipMapBySafetyCultureIds$(controllers$, safetyCultures$, links$);
  }

  public async removeAllForSafetyCultureId(
    projectId: string,
    safetyCultureId: string
  ): Promise<SafetyCultureControllerLink[]> {
    return this.linkRepo.removeAllForSafetyCultureId(projectId, safetyCultureId);
  }
}
