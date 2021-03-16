import { Service } from '@cast/src/main/services/common/Service';
import { ConstraintHazardLinkService } from '@cast/src/main/services/link-services/ConstraintHazardLinkService';
import { HazardTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hazard } from '../../models';
import { HazardRepo, LastIdRepo, ProjectRepo } from '../../repositories';

@injectable()
export class HazardService extends Service<Hazard> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(HazardRepo) private readonly hazardRepo: HazardRepo,
    @inject(ConstraintHazardLinkService) private readonly constraintHazardLinkService: ConstraintHazardLinkService
  ) {
    super(Hazard, projectRepo, hazardRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<HazardTableModel[]> {
    return combineLatest([
      this.getAll$(projectId),
      this.constraintHazardLinkService.getConstraintChipMapByHazardIds$(projectId),
    ]).pipe(
      map(([hazards, constraintChipMap]) => {
        return hazards.map(hazard => new HazardTableModel(hazard, constraintChipMap.get(hazard.id), []));
      })
    );
  }
}
