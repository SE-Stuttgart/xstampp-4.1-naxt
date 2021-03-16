import { Hazard } from '@stpa/src/main/models';
import { HazardRepo, ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { SubHazardService } from '@stpa/src/main/services/step-1/SubHazardService';
import { HazardLossLinkService } from '@stpa/src/main/services/link-services/HazardLossLinkService';
import { HazardSystemConstraintLinkService } from '@stpa/src/main/services/link-services/HazardSystemConstraintLinkService';
import { UnsafeControlActionHazardLinkService } from '@stpa/src/main/services/link-services/UnsafeControlActionHazardLinkService';
import { HazardTableEntry } from '@stpa/src/main/services/models';
import { toSubHazardChips } from '@stpa/src/main/services/util/chips/toChips';
import { toCombinedStringId } from '@stpa/src/main/services/util/chips/toCombinedIds';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectDependentService } from '../common/ProjectDependentService';

@injectable()
export class HazardService extends ProjectDependentService<Hazard> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,

    @inject(HazardRepo)
    private readonly hazardRepo: HazardRepo,
    @inject(SubHazardService)
    private readonly subHazardService: SubHazardService,
    @inject(HazardLossLinkService)
    private readonly lossLinkService: HazardLossLinkService,
    @inject(HazardSystemConstraintLinkService)
    private readonly systemConstraintLinkService: HazardSystemConstraintLinkService,
    @inject(UnsafeControlActionHazardLinkService)
    private readonly unsafeControlActionLinkService: UnsafeControlActionHazardLinkService
  ) {
    super(Hazard, projectRepo, hazardRepo, lastIdRepo);
  }

  public async remove(hazard: Hazard): Promise<boolean> {
    const isRemoved = super.remove(hazard);

    if (isRemoved) {
      const { projectId, id } = hazard;
      await this.subHazardService
        .getAll(projectId)
        .then(subHazards => subHazards.filter(hasParentId(id)))
        .then(subHazards => subHazards.forEach(this.subHazardService.remove));
      await this.lossLinkService.removeAllByHazardId(projectId, id);
      await this.systemConstraintLinkService.removeAllByHazardId(projectId, id);
      await this.unsafeControlActionLinkService.removeAllByHazardId(projectId, id);
    }

    return isRemoved;
  }

  public getAllTableEntries$(projectId: string): Observable<HazardTableEntry[]> {
    return combineLatest([
      this.hazardRepo.findAll$(projectId),
      this.subHazardService.getAll$(projectId),
      this.lossLinkService.getLossChipMapByHazardIds$(projectId),
      this.systemConstraintLinkService.getSystemConstraintChipMapByHazardIds$(projectId),
      this.unsafeControlActionLinkService.getUnsafeControlActionChipMapByHazardIds$(projectId),
    ]).pipe(
      map(([hazards, subHazards, lossChipMap, linkedSubsystemConstraintChipMap, unsafeControlActionChipMap]) => {
        return hazards.map(hazard => {
          const linkedSubHazardIds = subHazards.filter(isChildOf(hazard)).map(toCombinedStringId);
          return new HazardTableEntry(
            hazard,
            toSubHazardChips(subHazards, linkedSubHazardIds),
            lossChipMap.get(hazard.id),
            linkedSubsystemConstraintChipMap.get(hazard.id),
            unsafeControlActionChipMap.get(hazard.id)
          );
        });
      })
    );
  }
}

function hasParentId(id: number) {
  return subHazard => subHazard.parentId === id;
}

function isChildOf(hazard: Hazard) {
  return subHazard => subHazard.parentId === hazard.id;
}
