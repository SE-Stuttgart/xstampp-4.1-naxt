import { NAXTError } from '@src-shared/errors/NaxtError';
import { UnsafeControlActionHazardLink } from '@stpa/src/main/models';
import {
  HazardRepo,
  ProjectRepo,
  UnsafeControlActionHazardLinkRepo,
  UnsafeControlActionRepo,
} from '@stpa/src/main/repositories';
import { LinkService } from '@stpa/src/main/services/common/LinkService';
import { ChipMap } from '@stpa/src/main/services/util/chips/ChipMap';
import {
  toHazardChipMapByUnsafeControlActionId,
  toUnsafeControlActionChipMapByHazardId,
} from '@stpa/src/main/services/util/chips/toChipMap';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class UnsafeControlActionHazardLinkService extends LinkService<UnsafeControlActionHazardLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(UnsafeControlActionHazardLinkRepo)
    private readonly linkRepo: UnsafeControlActionHazardLinkRepo,
    @inject(UnsafeControlActionRepo) private readonly unsafeControlActionRepo: UnsafeControlActionRepo,
    @inject(HazardRepo) private readonly hazardRepo: HazardRepo
  ) {
    super(UnsafeControlActionHazardLink, projectRepo, linkRepo);
  }

  public async create(link: UnsafeControlActionHazardLink): Promise<UnsafeControlActionHazardLink | null> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: UnsafeControlActionHazardLink): Promise<void> {
    const { projectId, hazardId, unsafeControlActionId, controlActionId } = link;

    const ucaExists = await this.unsafeControlActionRepo.exists(projectId, controlActionId, unsafeControlActionId);
    if (!ucaExists) throw new NAXTError('No such unsafe control action exists:', link);

    const hazardExists = await this.hazardRepo.exists(projectId, hazardId);
    if (!hazardExists) throw new NAXTError('No such hazard exists:', link);
  }

  async removeAllByHazardId(projectId: string, hazardId: number): Promise<UnsafeControlActionHazardLink[]> {
    return this.linkRepo.removeAllByHazardId(projectId, hazardId);
  }

  async removeAllByUnsafeControlActionId(
    projectId: string,
    controlActionId: number,
    unsafeControlActionId: number
  ): Promise<UnsafeControlActionHazardLink[]> {
    return this.linkRepo.removeAllByUnsafeControlActionId(projectId, controlActionId, unsafeControlActionId);
  }

  public getUnsafeControlActionChipMapByHazardIds$(projectId: string): Observable<ChipMap> {
    const hazards$ = this.hazardRepo.findAll$(projectId);
    const unsafeControlActions$ = this.unsafeControlActionRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toUnsafeControlActionChipMapByHazardId(unsafeControlActions$, hazards$, links$);
  }

  public getHazardsChipMapByUnsafeControlActionIds$(projectId: string): Observable<ChipMap> {
    const hazards$ = this.hazardRepo.findAll$(projectId);
    const unsafeControlActions$ = this.unsafeControlActionRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toHazardChipMapByUnsafeControlActionId(hazards$, unsafeControlActions$, links$);
  }
}
