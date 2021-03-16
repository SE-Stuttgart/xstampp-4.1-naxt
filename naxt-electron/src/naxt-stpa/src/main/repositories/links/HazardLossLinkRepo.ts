import { Repository } from '@src-shared/rxdb-repository/Repository';
import { HazardLossLink } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class HazardLossLinkRepo extends Repository<HazardLossLink> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(HazardLossLink, StpaBaseQuery.hazardLossLink, dbConnector);
  }

  async removeAllByHazardId(projectId: string, hazardId: number): Promise<HazardLossLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('hazardId').eq(hazardId).remove();
  }

  async removeAllByLossId(projectId: string, lossId: number): Promise<HazardLossLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('lossId').eq(lossId).remove();
  }
}
