import { SafetyManagementSystem } from '@cast/src/main/models';
import { LastIdRepo, ProjectRepo, SafetyManagementSystemRepo } from '@cast/src/main/repositories';
import { Service } from '@cast/src/main/services/common/Service';
import { SafetyManagementSystemControllerLinkService } from '@cast/src/main/services/link-services/SafetyManagementSystemControllerLinkService';
import { SafetyManagementSystemTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class SafetyManagementSystemService extends Service<SafetyManagementSystem> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(SafetyManagementSystemRepo) private readonly safetyManagementSystemRepo: SafetyManagementSystemRepo,
    @inject(SafetyManagementSystemControllerLinkService)
    private readonly linkService: SafetyManagementSystemControllerLinkService
  ) {
    super(SafetyManagementSystem, projectRepo, safetyManagementSystemRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<SafetyManagementSystemTableModel[]> {
    return combineLatest([
      this.safetyManagementSystemRepo.findAll$(projectId),
      this.linkService.getControllerChipMapBySafetyManagementSystemIds$(projectId),
    ]).pipe(
      map(([safetyManagementSystems, controllerChipMap]) => {
        return safetyManagementSystems.map(
          safetyManagementSystem =>
            new SafetyManagementSystemTableModel(
              safetyManagementSystem,
              controllerChipMap.get(safetyManagementSystem.id),
              []
            )
        );
      })
    );
  }
}
