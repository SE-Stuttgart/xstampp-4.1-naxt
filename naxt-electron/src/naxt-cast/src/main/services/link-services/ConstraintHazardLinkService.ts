import { Constraint, ConstraintHazardLink, Hazard } from '@cast/src/main/models';
import { ConstraintHazardLinkRepo, ConstraintRepo, HazardRepo, ProjectRepo } from '@cast/src/main/repositories';
import { LinkService } from '@cast/src/main/services/common/LinkService';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import {
  toConstraintChipMapByHazardIds$,
  toHazardChipMapByConstraintIds$,
} from '@cast/src/main/services/util/toChipMap';
import { NAXTError } from '@src-shared/errors/NaxtError';

import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class ConstraintHazardLinkService extends LinkService<ConstraintHazardLink> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ConstraintHazardLinkRepo) private readonly constraintHazardLinkRepo: ConstraintHazardLinkRepo,
    @inject(HazardRepo) private readonly hazardRepo: HazardRepo,
    @inject(ConstraintRepo) private readonly constraintRepo: ConstraintRepo
  ) {
    super(ConstraintHazardLink, projectRepo, constraintHazardLinkRepo);
  }

  public async create(link: ConstraintHazardLink): Promise<ConstraintHazardLink> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: ConstraintHazardLink): Promise<void> {
    const { projectId, hazardId, constraintId } = link;

    const hazardExists = await this.hazardRepo._exists({ ...new Hazard(), projectId, id: hazardId });
    if (!hazardExists) throw new NAXTError('No such [hazard] exists:', link);

    const constraintExists = await this.constraintRepo._exists({ ...new Constraint(), projectId, id: constraintId });
    if (!constraintExists) throw new NAXTError('No such [constraint] exists:', link);
  }

  public async removeAllForConstraintId(projectId: string, constraintId: string): Promise<ConstraintHazardLink[]> {
    return this.constraintHazardLinkRepo.removeAllForConstraintId(projectId, constraintId);
  }

  public getConstraintChipMapByHazardIds$(projectId: string): Observable<ChipMap> {
    const constraints$ = this.constraintRepo.findAll$(projectId);
    const hazards$ = this.hazardRepo.findAll$(projectId);
    const links$ = this.constraintHazardLinkRepo.findAll$(projectId);
    return combineLatest([
      toConstraintChipMapByHazardIds$(constraints$, hazards$, links$),
      this.constraintHazardLinkRepo.findAll$(projectId),
    ]).pipe(
      map(([chips, links]) => {
        for (const key of chips.map.keys()) {
          chips.set(
            key,
            chips.get(key).filter(chip => {
              const alreadyLinkConstraintIds = links
                .filter(link => link.hazardId !== key)
                .map(link => link.constraintId);
              if (!chip.selected) return !alreadyLinkConstraintIds.includes(chip.id);
              return true;
            })
          );
        }
        return chips;
      })
    );
  }

  public getHazardChipMapByConstraintIds$(projectId: string): Observable<ChipMap> {
    const hazards$ = this.hazardRepo.findAll$(projectId);
    const constraints$ = this.constraintRepo.findAll$(projectId);
    const links$ = this.constraintHazardLinkRepo.findAll$(projectId);
    return toHazardChipMapByConstraintIds$(hazards$, constraints$, links$);
  }
}
