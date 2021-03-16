import { HazardLossLink, Loss } from '@stpa/src/main/models';
import { HazardLossLinkService } from '@stpa/src/main/services/link-services/HazardLossLinkService';
import { LossTableEntry } from '@stpa/src/main/services/models';
import { LossService } from '@stpa/src/main/services/step-1/LossService';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class LossController {
  constructor(
    @inject(LossService) private readonly lossService: LossService,
    @inject(HazardLossLinkService) private readonly hazardLossLinkService: HazardLossLinkService
  ) {}

  public async createLoss(loss: Loss): Promise<Loss> {
    return await this.lossService.create(loss);
  }

  public async updateLoss(loss: Loss): Promise<Loss | null> {
    return await this.lossService.update(loss);
  }

  public async removeLoss(loss: Loss): Promise<boolean> {
    return await this.lossService.remove(loss);
  }

  public getAll$(projectId: string): Observable<LossTableEntry[]> {
    return this.lossService.getAllTableEntries$(projectId);
  }

  public async createHazardLink(link: HazardLossLink): Promise<HazardLossLink | null> {
    return this.hazardLossLinkService.create(link);
  }

  public async removeHazardLink(link: HazardLossLink): Promise<boolean> {
    return this.hazardLossLinkService.remove(link);
  }
}
