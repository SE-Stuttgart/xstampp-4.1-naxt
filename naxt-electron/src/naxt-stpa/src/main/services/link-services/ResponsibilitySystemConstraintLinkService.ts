import { NAXTError } from '@src-shared/errors/NaxtError';
import { ResponsibilitySystemConstraintLink } from '@stpa/src/main/models';
import {
  ProjectRepo,
  ResponsibilityRepo,
  ResponsibilitySystemConstraintLinkRepo,
  SystemConstraintRepo,
} from '@stpa/src/main/repositories';
import { LinkService } from '@stpa/src/main/services/common/LinkService';
import { ChipMap } from '@stpa/src/main/services/util/chips/ChipMap';
import { toSystemConstraintChipMapByResponsibilityId } from '@stpa/src/main/services/util/chips/toChipMap';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ResponsibilitySystemConstraintLinkService extends LinkService<ResponsibilitySystemConstraintLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ResponsibilitySystemConstraintLinkRepo) private readonly linkRepo: ResponsibilitySystemConstraintLinkRepo,
    @inject(ResponsibilityRepo) private readonly responsibilityRepo: ResponsibilityRepo,
    @inject(SystemConstraintRepo) private readonly systemConstraintRepo: SystemConstraintRepo
  ) {
    super(ResponsibilitySystemConstraintLink, projectRepo, linkRepo);
  }

  public async create(link: ResponsibilitySystemConstraintLink): Promise<ResponsibilitySystemConstraintLink | null> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: ResponsibilitySystemConstraintLink): Promise<void> {
    const { projectId, systemConstraintId, responsibilityId } = link;

    const responsibilityExists = await this.responsibilityRepo.exists(projectId, responsibilityId);
    if (!responsibilityExists) throw new NAXTError('No such responsibility exists:', link);

    const systemConstraintExists = await this.systemConstraintRepo.exists(projectId, systemConstraintId);
    if (!systemConstraintExists) throw new NAXTError('No such system constraint exists:', link);
  }

  async removeAllBySystemConstraintId(
    projectId: string,
    systemConstraintId: number
  ): Promise<ResponsibilitySystemConstraintLink[]> {
    return this.linkRepo.removeAllBySystemConstraintId(projectId, systemConstraintId);
  }

  async removeAllByResponsibilityId(
    projectId: string,
    responsibilityId: number
  ): Promise<ResponsibilitySystemConstraintLink[]> {
    return this.linkRepo.removeAllByResponsibilityId(projectId, responsibilityId);
  }

  public getAllSystemConstraintsAsChipsMappedByResponsibilityIds$(projectId: string): Observable<ChipMap> {
    const responsibilities$ = this.responsibilityRepo.findAll$(projectId);
    const systemConstraints$ = this.systemConstraintRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toSystemConstraintChipMapByResponsibilityId(systemConstraints$, responsibilities$, links$);
  }
}
