import { NAXTError } from '@src-shared/errors/NaxtError';
import { UnsafeControlActionHazardLink, UnsafeControlActionSubHazardLink } from '@stpa/src/main/models';
import {
  ProjectRepo,
  SubHazardRepo,
  UnsafeControlActionHazardLinkRepo,
  UnsafeControlActionRepo,
  UnsafeControlActionSubHazardLinkRepo,
} from '@stpa/src/main/repositories';
import { LinkService } from '@stpa/src/main/services/common/LinkService';
import { ChipMap } from '@stpa/src/main/services/util/chips/ChipMap';
import {
  toSubHazardChipMapByUnsafeControlActionId,
  toUnsafeControlActionChipMapBySubHazardId,
} from '@stpa/src/main/services/util/chips/toChipMap';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class UnsafeControlActionSubHazardLinkService extends LinkService<UnsafeControlActionSubHazardLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(UnsafeControlActionSubHazardLinkRepo) private readonly linkRepo: UnsafeControlActionSubHazardLinkRepo,
    @inject(UnsafeControlActionRepo) private readonly unsafeControlActionRepo: UnsafeControlActionRepo,
    @inject(SubHazardRepo) private readonly subHazardRepo: SubHazardRepo,
    @inject(UnsafeControlActionHazardLinkRepo) private readonly parentLinkRepo: UnsafeControlActionHazardLinkRepo
  ) {
    super(UnsafeControlActionSubHazardLink, projectRepo, linkRepo);
  }

  public async create(link: UnsafeControlActionSubHazardLink): Promise<UnsafeControlActionSubHazardLink | null> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: UnsafeControlActionSubHazardLink): Promise<void> {
    const { projectId, hazardId, subHazardId, unsafeControlActionId, controlActionId } = link;

    const ucaExists = await this.unsafeControlActionRepo.exists(projectId, controlActionId, unsafeControlActionId);
    if (!ucaExists) throw new NAXTError('No such unsafe control action exists:', link);

    const subHazardExists = await this.subHazardRepo.exists(projectId, hazardId, subHazardId);
    if (!subHazardExists) throw new NAXTError('No such sub hazard exists:', link);
  }

  async removeAllBySubHazardId(
    projectId: string,
    hazardId: number,
    subHazardId: number
  ): Promise<UnsafeControlActionHazardLink[]> {
    return this.linkRepo.removeAllBySubHazardId(projectId, hazardId, subHazardId);
  }

  async removeAllByUnsafeControlActionId(
    projectId: string,
    controlActionId: number,
    unsafeControlActionId: number
  ): Promise<UnsafeControlActionHazardLink[]> {
    return this.linkRepo.removeAllByUnsafeControlActionId(projectId, controlActionId, unsafeControlActionId);
  }

  public getUnsafeControlActionChipMapBySubHazardIds$(projectId: string): Observable<ChipMap> {
    const subHazards$ = this.subHazardRepo.findAll$(projectId);
    const unsafeControlActions$ = this.unsafeControlActionRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    return toUnsafeControlActionChipMapBySubHazardId(unsafeControlActions$, subHazards$, links$);
  }

  public getSubHazardsChipMapByUnsafeControlActionIds$(projectId: string): Observable<ChipMap> {
    const subHazards$ = this.subHazardRepo.findAll$(projectId);
    const unsafeControlActions$ = this.unsafeControlActionRepo.findAll$(projectId);
    const links$ = this.linkRepo.findAll$(projectId);
    const parentLinks$ = this.parentLinkRepo.findAll$(projectId);

    const selectableSubHazards$ = combineLatest([parentLinks$, subHazards$]).pipe(
      map(([parentLinks, subHazards]) => {
        const hazardLinkIds = parentLinks.map(link => link.hazardId);
        return subHazards.filter(subHazard => hazardLinkIds.includes(subHazard.parentId));
      })
    );

    return toSubHazardChipMapByUnsafeControlActionId(selectableSubHazards$, unsafeControlActions$, links$);
  }
}
