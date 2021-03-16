import { Constraint, ConstraintHazardLink } from '@cast/src/main/models';
import { ConstraintHazardLinkService, ConstraintService } from '@cast/src/main/services';
import { ConstraintTableModel } from '@cast/src/main/services/models/table-models/step-1/ConstraintTableModel';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ConstraintController {
  constructor(
    @inject(ConstraintService) private readonly constraintService: ConstraintService,
    @inject(ConstraintHazardLinkService) private readonly constraintConstraintLinkService: ConstraintHazardLinkService
  ) {}

  public async create(projectId: string): Promise<Constraint> {
    return this.constraintService.create({ ...new Constraint(), projectId });
  }

  public getAll$(projectId: string): Observable<ConstraintTableModel[]> {
    return this.constraintService.getAllTableModels$(projectId);
  }

  public async update(hazard: Constraint): Promise<Constraint> {
    return this.constraintService.update(hazard);
  }

  public async remove(constraint: Constraint): Promise<boolean> {
    return this.constraintService.remove(constraint);
  }

  public async createHazardLink(link: ConstraintHazardLink): Promise<ConstraintHazardLink> {
    await this.constraintConstraintLinkService.removeAllForConstraintId(link.projectId, link.constraintId);
    return this.constraintConstraintLinkService.create(link);
  }

  public async removeHazardLink(link: ConstraintHazardLink): Promise<boolean> {
    return this.constraintConstraintLinkService.remove(link);
  }
}
