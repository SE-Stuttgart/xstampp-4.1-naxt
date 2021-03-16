import { Service } from '@cast/src/main/services/common/Service';
import { ConstraintResponsibilityLinkService } from '@cast/src/main/services/link-services/ConstraintResponsibilityLinkService';
import { ControllerResponsibilityLinkService } from '@cast/src/main/services/link-services/ControllerResponsibilityLinkService';
import { ResponsibilityTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Responsibility } from '../../models';
import { LastIdRepo, ProjectRepo, ResponsibilityRepo } from '../../repositories';

@injectable()
export class ResponsibilityService extends Service<Responsibility> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(ResponsibilityRepo) private readonly responsibilityRepo: ResponsibilityRepo,
    @inject(ControllerResponsibilityLinkService)
    private readonly controllerResponsibilityLinkService: ControllerResponsibilityLinkService,
    @inject(ConstraintResponsibilityLinkService)
    private readonly responsibilitySystemConstraintLinkService: ConstraintResponsibilityLinkService
  ) {
    super(Responsibility, projectRepo, responsibilityRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<ResponsibilityTableModel[]> {
    return combineLatest([
      this.getAll$(projectId),
      this.controllerResponsibilityLinkService.getControllerChipMapByHazardIds$(projectId),
      this.responsibilitySystemConstraintLinkService.getConstraintChipMapByResponsibilityIds$(projectId),
    ]).pipe(
      map(([responsibilities, controllerChipMap, constraintChipMap]) => {
        return responsibilities.map(
          responsibility =>
            new ResponsibilityTableModel(
              responsibility,
              constraintChipMap.get(responsibility.id),
              controllerChipMap.get(responsibility.id),
              []
            )
        );
      })
    );
  }
}
