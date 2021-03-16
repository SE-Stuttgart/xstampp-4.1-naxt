import { Service } from '@cast/src/main/services/common/Service';
import { InternalAndExternalEconomicsControllerLinkService } from '@cast/src/main/services/link-services/InternalAndExternalEconomicsControllerLinkService';
import { InternalAndExternalEconomicsTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InternalAndExternalEconomics } from '../../models';
import { InternalAndExternalEconomicsRepo, LastIdRepo, ProjectRepo } from '../../repositories';

@injectable()
export class InternalAndExternalEconomicsService extends Service<InternalAndExternalEconomics> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(InternalAndExternalEconomicsRepo)
    private readonly internalAndExternalEconomicsRepo: InternalAndExternalEconomicsRepo,
    @inject(InternalAndExternalEconomicsControllerLinkService)
    private readonly linkService: InternalAndExternalEconomicsControllerLinkService
  ) {
    super(InternalAndExternalEconomics, projectRepo, internalAndExternalEconomicsRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<InternalAndExternalEconomicsTableModel[]> {
    return combineLatest([
      this.internalAndExternalEconomicsRepo.findAll$(projectId),
      this.linkService.getControllerChipMapByInternalAndExternalEconomicsIds$(projectId),
    ]).pipe(
      map(([economics, controllerChipMap]) => {
        return economics.map(
          economic => new InternalAndExternalEconomicsTableModel(economic, controllerChipMap.get(economic.id), [])
        );
      })
    );
  }
}
