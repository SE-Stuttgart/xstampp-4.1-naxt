import { ConstraintHazardLink, Hazard } from '@cast/src/main/models';
import { ConstraintHazardLinkService, HazardService } from '@cast/src/main/services';
import { HazardTableModel } from '@cast/src/main/services/models/table-models/step-1/HazardTableModel';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class HazardController {
  constructor(
    @inject(HazardService) private readonly hazardService: HazardService,
    @inject(ConstraintHazardLinkService) private readonly constraintHazardLinkService: ConstraintHazardLinkService
  ) {}

  public async create(projectId: string): Promise<Hazard> {
    return this.hazardService.create({ ...new Hazard(), projectId });
  }

  public getAll$(projectId: string): Observable<HazardTableModel[]> {
    return this.hazardService.getAllTableModels$(projectId);
  }

  public async update(hazard: Hazard): Promise<Hazard> {
    return this.hazardService.update(hazard);
  }

  public async remove(hazard: Hazard): Promise<boolean> {
    return this.hazardService.remove(hazard);
  }

  public async createConstraintLink(link: ConstraintHazardLink): Promise<ConstraintHazardLink> {
    return this.constraintHazardLinkService.create(link);
  }

  public async removeConstraintLink(link: ConstraintHazardLink): Promise<boolean> {
    return this.constraintHazardLinkService.remove(link);
  }
}
