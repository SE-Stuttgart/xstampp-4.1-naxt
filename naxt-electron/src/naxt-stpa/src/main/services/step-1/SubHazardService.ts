import { ParentId } from '@src-shared/Interfaces';
import { Hazard, SubHazard, SubHazardLastId } from '@stpa/src/main/models';
import {
  HazardRepo,
  ProjectRepo,
  SubHazardLastIdRepo,
  SubHazardRepo,
  SubSystemConstraintRepo,
  SystemConstraintRepo,
} from '@stpa/src/main/repositories';
import { UnsafeControlActionSubHazardLinkService } from '@stpa/src/main/services/link-services/UnsafeControlActionSubHazardLinkService';
import { ChipPrefix, compareIds, SubHazardTableEntry } from '@stpa/src/main/services/models';
import { toHazardChips, toSubSystemConstraintChips } from '@stpa/src/main/services/util/chips/toChips';
import { toCombinedStringId } from '@stpa/src/main/services/util/chips/toCombinedIds';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityDependentService } from '../common/EntityDependentService';

@injectable()
export class SubHazardService extends EntityDependentService<SubHazard, Hazard, SubHazardLastId> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(SubHazardLastIdRepo) lastIdRepo: SubHazardLastIdRepo,
    @inject(HazardRepo)
    private readonly hazardRepo: HazardRepo,
    @inject(SubHazardRepo)
    private readonly subHazardRepo: SubHazardRepo,
    @inject(SystemConstraintRepo)
    private readonly systemConstraintRepo: SystemConstraintRepo,
    @inject(SubSystemConstraintRepo)
    private readonly subSystemConstraintRepo: SubSystemConstraintRepo,
    @inject(UnsafeControlActionSubHazardLinkService)
    private unsafeControlActionLinkService: UnsafeControlActionSubHazardLinkService
  ) {
    super(SubHazard, projectRepo, hazardRepo, subHazardRepo, lastIdRepo);
  }

  async remove(subHazard: SubHazard): Promise<boolean> {
    const isRemoved = super.remove(subHazard);
    if (isRemoved) {
      const { projectId, parentId, id } = subHazard;
      await this.subSystemConstraintRepo.removeAllBySubHazardId(projectId, parentId, id);
      await this.unsafeControlActionLinkService.removeAllBySubHazardId(projectId, parentId, id);
    }
    return isRemoved;
  }

  public getPossibleParents$(projectId: string): Observable<Hazard[]> {
    return this.hazardRepo.findAll$(projectId).pipe(
      map(hazards =>
        hazards.sort(compareIds).map(hazard => {
          return { ...hazard, name: `${ChipPrefix.Hazard}${hazard.id} ${hazard.name}` };
        })
      )
    );
  }

  public getAllTableEntries$(projectId: string): Observable<SubHazardTableEntry[]> {
    return combineLatest([
      this.hazardRepo.findAll$(projectId),
      this.subHazardRepo.findAll$(projectId),
      this.subSystemConstraintRepo.findAll$(projectId),
      this.unsafeControlActionLinkService.getUnsafeControlActionChipMapBySubHazardIds$(projectId),
    ]).pipe(
      map(([hazards, subHazards, subSystemConstraints, unsafeControlActionChipMap]) => {
        return subHazards.map(subHazard => {
          const parentHazard = hazards.find(isParentOf(subHazard));
          const linkedSubSystemConstraint = subSystemConstraints.find(isLinkedTo(subHazard));
          const linkedSubSystemConstraintIds = linkedSubSystemConstraint
            ? [toCombinedStringId(linkedSubSystemConstraint)]
            : [];
          return new SubHazardTableEntry(
            subHazard,
            toHazardChips(hazards, [parentHazard.id.toString()]),
            toSubSystemConstraintChips(subSystemConstraints, linkedSubSystemConstraintIds),
            unsafeControlActionChipMap.get(subHazard.id, subHazard.parentId)
          );
        });
      })
    );
  }
}

function isLinkedTo(subHazard: SubHazard) {
  return subSystemConstraint =>
    subSystemConstraint.hazardId === subHazard.parentId && subSystemConstraint.subHazardId === subHazard.id;
}

function isParentOf(child: ParentId) {
  return parent => parent.id === child.parentId;
}
