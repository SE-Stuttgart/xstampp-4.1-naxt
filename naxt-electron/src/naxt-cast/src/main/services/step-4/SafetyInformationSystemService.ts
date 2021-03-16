import { SafetyInformationSystem } from '@cast/src/main/models';
import { LastIdRepo, ProjectRepo, SafetyInformationSystemRepo } from '@cast/src/main/repositories';
import { Service } from '@cast/src/main/services/common/Service';
import { SafetyInformationSystemControllerLinkService } from '@cast/src/main/services/link-services/SafetyInformationSystemControllerLinkService';
import { SafetyInformationSystemTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class SafetyInformationSystemService extends Service<SafetyInformationSystem> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(SafetyInformationSystemRepo) private readonly safetyInformationSystemRepo: SafetyInformationSystemRepo,
    @inject(SafetyInformationSystemControllerLinkService)
    private readonly linkService: SafetyInformationSystemControllerLinkService
  ) {
    super(SafetyInformationSystem, projectRepo, safetyInformationSystemRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<SafetyInformationSystemTableModel[]> {
    return combineLatest([
      this.safetyInformationSystemRepo.findAll$(projectId),
      this.linkService.getControllerChipMapBySafetyInformationSystemIds$(projectId),
    ]).pipe(
      map(([safetyInformationSystems, controllerChipMap]) => {
        return safetyInformationSystems.map(
          safetyInfoSystem =>
            new SafetyInformationSystemTableModel(safetyInfoSystem, controllerChipMap.get(safetyInfoSystem.id), [])
        );
      })
    );
  }
}
