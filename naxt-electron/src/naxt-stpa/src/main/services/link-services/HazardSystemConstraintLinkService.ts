import { NAXTError } from '@src-shared/errors/NaxtError';
import { HazardLossLink, HazardSystemConstraintLink } from '@stpa/src/main/models';
import {
  HazardRepo,
  HazardSystemConstraintLinkRepo,
  ProjectRepo,
  SystemConstraintRepo,
} from '@stpa/src/main/repositories';
import { LinkService } from '@stpa/src/main/services/common/LinkService';
import { ChipMap } from '@stpa/src/main/services/util/chips/ChipMap';
import {
  toHazardChipMapBySystemConstraintId,
  toSystemConstraintChipMapByHazardId,
} from '@stpa/src/main/services/util/chips/toChipMap';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class HazardSystemConstraintLinkService extends LinkService<HazardSystemConstraintLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(HazardSystemConstraintLinkRepo) private readonly linkRepo: HazardSystemConstraintLinkRepo,
    @inject(HazardRepo) private readonly hazardRepo: HazardRepo,
    @inject(SystemConstraintRepo) private readonly systemConstraintRepo: SystemConstraintRepo
  ) {
    super(HazardSystemConstraintLink, projectRepo, linkRepo);
  }

  public async create(link: HazardSystemConstraintLink): Promise<HazardSystemConstraintLink | null> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: HazardSystemConstraintLink): Promise<void> {
    const { projectId, systemConstraintId, hazardId } = link;

    const hazardExists = await this.hazardRepo.exists(projectId, hazardId);
    if (!hazardExists) throw new NAXTError('No such hazard exists:', link);

    const systemConstraintExists = await this.systemConstraintRepo.exists(projectId, systemConstraintId);
    if (!systemConstraintExists) throw new NAXTError('No such system constraint exists:', link);
  }

  public async removeAllByHazardId(projectId: string, hazardId: number): Promise<HazardSystemConstraintLink[]> {
    return this.linkRepo.removeAllByHazardId(projectId, hazardId);
  }

  public async removeAllBySystemConstraintId(
    projectId: string,
    systemConstraintId: number
  ): Promise<HazardSystemConstraintLink[]> {
    return this.linkRepo.removeAllBySystemConstraintId(projectId, systemConstraintId);
  }

  public getHazardChipMapBySystemConstraintIds$(projectId: string): Observable<ChipMap> {
    const hazards$ = this.hazardRepo.findAll$(projectId);
    const systemConstraints$ = this.systemConstraintRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toHazardChipMapBySystemConstraintId(hazards$, systemConstraints$, links$);
  }

  public getSystemConstraintChipMapByHazardIds$(projectId: string): Observable<ChipMap> {
    const hazards$ = this.hazardRepo.findAll$(projectId);
    const systemConstraints$ = this.systemConstraintRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toSystemConstraintChipMapByHazardId(systemConstraints$, hazards$, links$);
  }
}
