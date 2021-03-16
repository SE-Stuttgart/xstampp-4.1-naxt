import { ChangesAndDynamicsOverTime } from '@cast/src/main/models';
import { Service } from '@cast/src/main/services/common/Service';
import { ChangesAndDynamicsOverTimeControllerLinkService } from '@cast/src/main/services/link-services/ChangesAndDynamicsOverTimeControllerLinkService';
import { ChangesAndDynamicsOverTimeTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangesAndDynamicsOverTimeRepo, LastIdRepo, ProjectRepo } from '../../repositories';

@injectable()
export class ChangesAndDynamicsOverTimeService extends Service<ChangesAndDynamicsOverTime> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(ChangesAndDynamicsOverTimeRepo)
    private readonly changesAndDynamicsOverTimeRepo: ChangesAndDynamicsOverTimeRepo,
    @inject(ChangesAndDynamicsOverTimeControllerLinkService)
    private readonly linkService: ChangesAndDynamicsOverTimeControllerLinkService
  ) {
    super(ChangesAndDynamicsOverTime, projectRepo, changesAndDynamicsOverTimeRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<ChangesAndDynamicsOverTimeTableModel[]> {
    return combineLatest([
      this.changesAndDynamicsOverTimeRepo.findAll$(projectId),
      this.linkService.getControllerChipMapByChangesAndDynamicOverTimeIds$(projectId),
    ]).pipe(
      map(([changesAndDynamics, controllerChipMap]) => {
        return changesAndDynamics.map(
          changesAndDynamic =>
            new ChangesAndDynamicsOverTimeTableModel(changesAndDynamic, controllerChipMap.get(changesAndDynamic.id), [])
        );
      })
    );
  }
}
