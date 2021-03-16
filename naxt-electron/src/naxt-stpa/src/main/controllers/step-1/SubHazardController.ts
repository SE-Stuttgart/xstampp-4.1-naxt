import { Hazard, SubHazard, UnsafeControlActionSubHazardLink } from '@stpa/src/main/models';
import { UnsafeControlActionSubHazardLinkService } from '@stpa/src/main/services/link-services/UnsafeControlActionSubHazardLinkService';
import { SubHazardTableEntry } from '@stpa/src/main/services/models';
import { SubHazardService } from '@stpa/src/main/services/step-1/SubHazardService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class SubHazardController {
  constructor(
    @inject(SubHazardService) private readonly subHazardService: SubHazardService,
    @inject(UnsafeControlActionSubHazardLinkService)
    private readonly unsafeControlActionSubHazardLinkService: UnsafeControlActionSubHazardLinkService
  ) {}

  public async createSubHazard(subHazard: SubHazard): Promise<SubHazard> {
    return await this.subHazardService.create(subHazard);
  }

  public async updateSubHazard(subHazard: SubHazard): Promise<SubHazard | null> {
    return await this.subHazardService.update(subHazard);
  }

  public async removeSubHazard(subHazard: SubHazard): Promise<boolean> {
    return await this.subHazardService.remove(subHazard);
  }

  public getAll$(projectId: string): Observable<SubHazardTableEntry[]> {
    return this.subHazardService.getAllTableEntries$(projectId);
  }

  public async createUCALink(link: UnsafeControlActionSubHazardLink): Promise<UnsafeControlActionSubHazardLink | null> {
    return this.unsafeControlActionSubHazardLinkService.create(link);
  }

  public async removeUCALink(link: UnsafeControlActionSubHazardLink): Promise<boolean> {
    return this.unsafeControlActionSubHazardLinkService.remove(link);
  }

  public getPossibleParents$(projectId: string): Observable<Hazard[]> {
    return this.subHazardService.getPossibleParents$(projectId);
  }
}
