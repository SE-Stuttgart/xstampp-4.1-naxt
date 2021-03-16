import { ControlAction } from '@src-shared/control-structure/models';
import {
  UnsafeControlAction,
  UnsafeControlActionHazardLink,
  UnsafeControlActionSubHazardLink,
} from '@stpa/src/main/models';
import { UnsafeControlActionHazardLinkService, UnsafeControlActionSubHazardLinkService } from '@stpa/src/main/services';
import { UnsafeControlActionTableEntry } from '@stpa/src/main/services/models';
import { UnsafeControlActionService } from '@stpa/src/main/services/step-3/UnsafeControlActionService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class UnsafeControlActionController {
  constructor(
    @inject(UnsafeControlActionService) private readonly unsafeControlActionService: UnsafeControlActionService,
    @inject(UnsafeControlActionHazardLinkService)
    private readonly unsafeControlActionHazardLinkService: UnsafeControlActionHazardLinkService,
    @inject(UnsafeControlActionSubHazardLinkService)
    private readonly unsafeControlActionSubHazardLinkService: UnsafeControlActionSubHazardLinkService
  ) {}

  public async createUnsafeControlAction(unsafeControlAction: UnsafeControlAction): Promise<UnsafeControlAction> {
    return await this.unsafeControlActionService.create(unsafeControlAction);
  }

  public async updateUnsafeControlAction(
    unsafeControlAction: UnsafeControlAction
  ): Promise<UnsafeControlAction | null> {
    return await this.unsafeControlActionService.update(unsafeControlAction);
  }

  public async removeUnsafeControlAction(unsafeControlAction: UnsafeControlAction): Promise<boolean> {
    return await this.unsafeControlActionService.remove(unsafeControlAction);
  }

  public getAll$(projectId: string): Observable<UnsafeControlActionTableEntry[]> {
    return this.unsafeControlActionService.getAllTableEntries$(projectId);
  }

  public async createHazardLink(link: UnsafeControlActionHazardLink): Promise<UnsafeControlActionHazardLink | null> {
    return this.unsafeControlActionHazardLinkService.create(link);
  }

  public async removeHazardLink(link: UnsafeControlActionHazardLink): Promise<boolean> {
    return this.unsafeControlActionHazardLinkService.remove(link);
  }

  public async createSubHazardLink(
    link: UnsafeControlActionSubHazardLink
  ): Promise<UnsafeControlActionSubHazardLink | null> {
    return this.unsafeControlActionSubHazardLinkService.create(link);
  }

  public async removeSubHazardLink(link: UnsafeControlActionSubHazardLink): Promise<boolean> {
    return this.unsafeControlActionSubHazardLinkService.remove(link);
  }

  public getRequiredEntries$(projectId: string): Observable<ControlAction[]> {
    return this.unsafeControlActionService.getRequiredEntries$(projectId);
  }
}
