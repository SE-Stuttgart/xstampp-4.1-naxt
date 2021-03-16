import { SubSystemConstraint } from '@stpa/src/main/models';
import { RequiredModels, SubSystemConstraintTableEntry } from '@stpa/src/main/services/models';
import { SubSystemConstraintService } from '@stpa/src/main/services/step-1/SubSystemConstraintService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class SubSystemConstraintController {
  constructor(
    @inject(SubSystemConstraintService) private readonly subSystemConstraintService: SubSystemConstraintService
  ) {
    this.subSystemConstraintService = subSystemConstraintService;
  }

  public async createSubSystemConstraint(subSystemConstraint: SubSystemConstraint): Promise<SubSystemConstraint> {
    return await this.subSystemConstraintService.create(subSystemConstraint);
  }

  public async updateSubSystemConstraint(
    subSystemConstraint: SubSystemConstraint
  ): Promise<SubSystemConstraint | null> {
    return await this.subSystemConstraintService.update(subSystemConstraint);
  }

  public async removeSubSystemConstraint(subSystemConstraint: SubSystemConstraint): Promise<boolean> {
    return await this.subSystemConstraintService.remove(subSystemConstraint);
  }

  public getAll$(projectId: string): Observable<SubSystemConstraintTableEntry[]> {
    return this.subSystemConstraintService.getAllTableEntries$(projectId);
  }

  public getRequiredEntries$(projectId: string): Observable<RequiredModels> {
    return this.subSystemConstraintService.getRequiredEntries$(projectId);
  }
}
