import { SafetyCulture } from '@cast/src/main/models';
import { LastIdRepo, ProjectRepo, SafetyCultureRepo } from '@cast/src/main/repositories';
import { Service } from '@cast/src/main/services/common/Service';
import { SafetyCultureControllerLinkService } from '@cast/src/main/services/link-services/SafetyCultureControllerLinkService';
import { SafetyCultureTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class SafetyCultureService extends Service<SafetyCulture> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(SafetyCultureRepo) private readonly safetyCultureRepo: SafetyCultureRepo,
    @inject(SafetyCultureControllerLinkService) private readonly linkService: SafetyCultureControllerLinkService
  ) {
    super(SafetyCulture, projectRepo, safetyCultureRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<SafetyCultureTableModel[]> {
    return combineLatest([
      this.safetyCultureRepo.findAll$(projectId),
      this.linkService.getControllerChipMapBySafetyCultureIds$(projectId),
    ]).pipe(
      map(([safetyCultures, controllerChipMap]) => {
        return safetyCultures.map(
          safetyCulture => new SafetyCultureTableModel(safetyCulture, controllerChipMap.get(safetyCulture.id), [])
        );
      })
    );
  }
}
