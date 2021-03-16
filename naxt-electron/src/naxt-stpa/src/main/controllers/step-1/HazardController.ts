import {
  Hazard,
  HazardLossLink,
  HazardSystemConstraintLink,
  UnsafeControlActionHazardLink,
} from '@stpa/src/main/models';
import {
  HazardLossLinkService,
  HazardService,
  HazardSystemConstraintLinkService,
  UnsafeControlActionHazardLinkService,
} from '@stpa/src/main/services';
import { HazardTableEntry } from '@stpa/src/main/services/models';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class HazardController {
  constructor(
    @inject(HazardService) private readonly hazardService: HazardService,
    @inject(HazardLossLinkService) private readonly hazardLossLinkService: HazardLossLinkService,
    @inject(HazardSystemConstraintLinkService)
    private readonly hazardSystemConstraintLinkService: HazardSystemConstraintLinkService,
    @inject(UnsafeControlActionHazardLinkService)
    private readonly unsafeControlActionHazardLinkService: UnsafeControlActionHazardLinkService
  ) {}

  public async createHazard(hazard: Hazard): Promise<Hazard> {
    return await this.hazardService.create(hazard);
  }

  public async updateHazard(hazard: Hazard): Promise<Hazard | null> {
    return await this.hazardService.update(hazard);
  }

  public async removeHazard(hazard: Hazard): Promise<boolean> {
    return await this.hazardService.remove(hazard);
  }

  public getAll$(projectId: string): Observable<HazardTableEntry[]> {
    return this.hazardService.getAllTableEntries$(projectId);
  }

  public async createLossLink(link: HazardLossLink): Promise<HazardLossLink | null> {
    return this.hazardLossLinkService.create(link);
  }

  public async removeLossLink(link: HazardLossLink): Promise<boolean> {
    return this.hazardLossLinkService.remove(link);
  }

  public async createSystemConstraintLink(
    link: HazardSystemConstraintLink
  ): Promise<HazardSystemConstraintLink | null> {
    return this.hazardSystemConstraintLinkService.create(link);
  }

  public async removeSystemConstraintLink(link: HazardSystemConstraintLink): Promise<boolean> {
    return this.hazardSystemConstraintLinkService.remove(link);
  }

  public async createUCALink(link: UnsafeControlActionHazardLink): Promise<UnsafeControlActionHazardLink | null> {
    return this.unsafeControlActionHazardLinkService.create(link);
  }

  public async removeUCALink(link: UnsafeControlActionHazardLink): Promise<boolean> {
    return this.unsafeControlActionHazardLinkService.remove(link);
  }
}
