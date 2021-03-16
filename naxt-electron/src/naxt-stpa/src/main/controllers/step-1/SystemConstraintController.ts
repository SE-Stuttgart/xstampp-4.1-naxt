import { HazardSystemConstraintLink, SystemConstraint } from '@stpa/src/main/models';
import { HazardSystemConstraintLinkService } from '@stpa/src/main/services/link-services/HazardSystemConstraintLinkService';
import { SystemConstraintTableEntry } from '@stpa/src/main/services/models';
import { SystemConstraintService } from '@stpa/src/main/services/step-1/SystemConstraintService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class SystemConstraintController {
  constructor(
    @inject(SystemConstraintService) private readonly systemConstraintService: SystemConstraintService,
    @inject(HazardSystemConstraintLinkService)
    private readonly hazardSystemConstraintLinkService: HazardSystemConstraintLinkService
  ) {}

  public async createSystemConstraint(systemConstraint: SystemConstraint): Promise<SystemConstraint> {
    return await this.systemConstraintService.create(systemConstraint);
  }

  public async updateSystemConstraint(systemConstraint: SystemConstraint): Promise<SystemConstraint | null> {
    return await this.systemConstraintService.update(systemConstraint);
  }

  public async removeSystemConstraint(systemConstraint: SystemConstraint): Promise<boolean> {
    return await this.systemConstraintService.remove(systemConstraint);
  }

  public getAll$(projectId: string): Observable<SystemConstraintTableEntry[]> {
    return this.systemConstraintService.getAllTableEntries$(projectId);
  }

  public async createHazardLink(link: HazardSystemConstraintLink): Promise<HazardSystemConstraintLink | null> {
    return this.hazardSystemConstraintLinkService.create(link);
  }

  public async removeHazardLink(link: HazardSystemConstraintLink): Promise<boolean> {
    return this.hazardSystemConstraintLinkService.remove(link);
  }
}
