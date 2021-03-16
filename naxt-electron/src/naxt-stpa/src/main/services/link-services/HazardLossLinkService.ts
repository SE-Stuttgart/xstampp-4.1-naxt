import { NAXTError } from '@src-shared/errors/NaxtError';
import { HazardLossLink } from '@stpa/src/main/models';
import { HazardLossLinkRepo, HazardRepo, LossRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { LinkService } from '@stpa/src/main/services/common/LinkService';
import { ChipMap } from '@stpa/src/main/services/util/chips/ChipMap';
import { toHazardChipMapByLossId, toLossChipMapByHazardId } from '@stpa/src/main/services/util/chips/toChipMap';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class HazardLossLinkService extends LinkService<HazardLossLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(HazardLossLinkRepo) private readonly linkRepo: HazardLossLinkRepo,
    @inject(HazardRepo) private readonly hazardRepo: HazardRepo,
    @inject(LossRepo) private readonly lossRepo: LossRepo
  ) {
    super(HazardLossLink, projectRepo, linkRepo);
  }

  public async create(link: HazardLossLink): Promise<HazardLossLink | null> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: HazardLossLink): Promise<void> {
    const { projectId, hazardId, lossId } = link;

    const hazardExists = await this.hazardRepo.exists(projectId, hazardId);
    if (!hazardExists) throw new NAXTError('No such hazard exists:', link);

    const lossExists = await this.lossRepo.exists(projectId, lossId);
    if (!lossExists) throw new NAXTError('No such loss exists:', link);
  }

  async removeAllByHazardId(projectId: string, hazardId: number): Promise<HazardLossLink[]> {
    return this.linkRepo.removeAllByHazardId(projectId, hazardId);
  }

  async removeAllByLossId(projectId: string, lossId: number): Promise<HazardLossLink[]> {
    return this.linkRepo.removeAllByLossId(projectId, lossId);
  }

  public getLossChipMapByHazardIds$(projectId: string): Observable<ChipMap> {
    const hazards$ = this.hazardRepo.findAll$(projectId);
    const losses$ = this.lossRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toLossChipMapByHazardId(losses$, hazards$, links$);
  }

  public getHazardChipMapByLossIds$(projectId: string): Observable<ChipMap> {
    const hazards$ = this.hazardRepo.findAll$(projectId);
    const losses$ = this.lossRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toHazardChipMapByLossId(hazards$, losses$, links$);
  }
}
