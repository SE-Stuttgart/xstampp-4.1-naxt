import { Service } from '@cast/src/main/services/common/Service';
import { ConstraintHazardLinkService } from '@cast/src/main/services/link-services/ConstraintHazardLinkService';
import { ConstraintTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Constraint } from '../../models';
import { ConstraintRepo, LastIdRepo, ProjectRepo } from '../../repositories';

@injectable()
export class ConstraintService extends Service<Constraint> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(ConstraintRepo) private readonly constraintRepo: ConstraintRepo,
    @inject(ConstraintHazardLinkService) private readonly constraintHazardLinkService: ConstraintHazardLinkService
  ) {
    super(Constraint, projectRepo, constraintRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<ConstraintTableModel[]> {
    return combineLatest([
      this.getAll$(projectId),
      this.constraintHazardLinkService.getHazardChipMapByConstraintIds$(projectId),
    ]).pipe(
      map(([constraints, constraintChipMap]) => {
        return constraints.map(
          constraint => new ConstraintTableModel(constraint, constraintChipMap.get(constraint.id), [])
        );
      })
    );
  }
}
