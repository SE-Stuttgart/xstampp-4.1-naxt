import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { ImplementationConstraint } from '../../models';
import { ImplementationConstraintService } from '../../services';
import { ImplementationConstraintTableEntry, RequiredModels } from '../../services/models';

@injectable()
export class ImplementationConstraintController {
  constructor(
    @inject(ImplementationConstraintService)
    private readonly implementationConstraintService: ImplementationConstraintService
  ) {}

  public async create(implementationConstraint: ImplementationConstraint): Promise<ImplementationConstraint> {
    return await this.implementationConstraintService.create(implementationConstraint);
  }

  public async update(implementationConstraint: ImplementationConstraint): Promise<ImplementationConstraint | null> {
    return await this.implementationConstraintService.update(implementationConstraint);
  }

  public async remove(implementationConstraint: ImplementationConstraint): Promise<boolean> {
    return await this.implementationConstraintService.remove(implementationConstraint);
  }

  public getAll$(projectId: string): Observable<ImplementationConstraintTableEntry[]> {
    return this.implementationConstraintService.getAllTableEntries$(projectId);
  }

  public getRequiredEntries$(projectId: string): Observable<RequiredModels> {
    return this.implementationConstraintService.getRequiredEntries$(projectId);
  }
}
