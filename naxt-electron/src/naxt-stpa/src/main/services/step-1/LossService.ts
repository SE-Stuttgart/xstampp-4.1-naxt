import { Loss } from '@stpa/src/main/models';
import { LossRepo, ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { HazardLossLinkService } from '@stpa/src/main/services/link-services/HazardLossLinkService';
import { LossTableEntry } from '@stpa/src/main/services/models/table-models/step-1/LossTableEntry';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectDependentService } from '../common/ProjectDependentService';

@injectable()
export class LossService extends ProjectDependentService<Loss> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,

    @inject(LossRepo)
    private readonly lossRepo: LossRepo,
    @inject(HazardLossLinkService)
    private readonly hazardLinkService: HazardLossLinkService
  ) {
    super(Loss, projectRepo, lossRepo, lastIdRepo);
  }

  async remove(loss: Loss): Promise<boolean> {
    const isRemoved = super.remove(loss);
    if (isRemoved) await this.hazardLinkService.removeAllByLossId(loss.projectId, loss.id);
    return isRemoved;
  }

  public getAllTableEntries$(projectId: string): Observable<LossTableEntry[]> {
    return combineLatest([
      this.lossRepo.findAll$(projectId),
      this.hazardLinkService.getHazardChipMapByLossIds$(projectId),
    ]).pipe(
      map(([losses, lossIdHazardChipMap]) => {
        return losses.map(loss => new LossTableEntry(loss, lossIdHazardChipMap.get(loss.id)));
      })
    );
  }
}
