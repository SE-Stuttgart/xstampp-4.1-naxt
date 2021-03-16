import { Controller } from '@src-shared/control-structure/models';
import {
  Responsibility,
  ResponsibilitySubSystemConstraintLink,
  ResponsibilitySystemConstraintLink,
} from '@stpa/src/main/models';
import { ResponsibilitySystemConstraintLinkService } from '@stpa/src/main/services/link-services/ResponsibilitySystemConstraintLinkService';
import { ResponsibilitySubSystemConstraintLinkService, ResponsibilityTableEntry } from '@stpa/src/main/services/models';
import { ResponsibilityService } from '@stpa/src/main/services/step-2/ResponsibilityService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class ResponsibilityController {
  constructor(
    @inject(ResponsibilityService) private readonly responsibilityService: ResponsibilityService,
    @inject(ResponsibilitySystemConstraintLinkService)
    private readonly responsibilitySystemConstraintLinkService: ResponsibilitySystemConstraintLinkService,
    @inject(ResponsibilitySubSystemConstraintLinkService)
    private readonly responsibilitySubSystemConstraintLinkService: ResponsibilitySubSystemConstraintLinkService
  ) {}

  public async createResponsibility(responsibility: Responsibility): Promise<Responsibility> {
    return await this.responsibilityService.create(responsibility);
  }

  public async updateResponsibility(responsibility: Responsibility): Promise<Responsibility | null> {
    return await this.responsibilityService.update(responsibility);
  }

  public async removeResponsibility(responsibility: Responsibility): Promise<boolean> {
    return await this.responsibilityService.remove(responsibility);
  }

  public getAll$(projectId: string): Observable<ResponsibilityTableEntry[]> {
    return this.responsibilityService.getAllTableEntries$(projectId);
  }

  public async createSystemConstraintLink(
    link: ResponsibilitySystemConstraintLink
  ): Promise<ResponsibilitySystemConstraintLink | null> {
    return this.responsibilitySystemConstraintLinkService.create(link);
  }

  public async removeSystemConstraintLink(link: ResponsibilitySystemConstraintLink): Promise<boolean> {
    return this.responsibilitySystemConstraintLinkService.remove(link);
  }

  public async createSubSystemConstraintLink(
    link: ResponsibilitySubSystemConstraintLink
  ): Promise<ResponsibilitySubSystemConstraintLink | null> {
    return this.responsibilitySubSystemConstraintLinkService.create(link);
  }

  public async removeSubSystemConstraintLink(link: ResponsibilitySubSystemConstraintLink): Promise<boolean> {
    return this.responsibilitySubSystemConstraintLinkService.remove(link);
  }

  public getRequiredEntries$(projectId: string): Observable<Controller[]> {
    return this.responsibilityService.getRequiredEntries$(projectId);
  }
}
