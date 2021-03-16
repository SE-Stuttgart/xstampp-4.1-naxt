import { RoleInTheAccident } from '@cast/src/main/models';
import { RoleInTheAccidentService } from '@cast/src/main/services';
import { RoleInTheAccidentTableModel } from '@cast/src/main/services/models/table-models/step-3/RoleInTheAccidentTableModel';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class RoleInTheAccidentController {
  constructor(@inject(RoleInTheAccidentService) private readonly roleInTheAccidentService: RoleInTheAccidentService) {}

  public async update(roleInTheAccident: RoleInTheAccident): Promise<RoleInTheAccident> {
    return this.roleInTheAccidentService.update(roleInTheAccident);
  }

  public getAllTableModels$(projectId: string): Observable<RoleInTheAccidentTableModel[]> {
    return this.roleInTheAccidentService.getAllTableModels$(projectId);
  }
}
