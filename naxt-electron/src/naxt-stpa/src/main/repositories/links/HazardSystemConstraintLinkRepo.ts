import { Repository } from '@src-shared/rxdb-repository/Repository';
import { HazardSystemConstraintLink } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class HazardSystemConstraintLinkRepo extends Repository<HazardSystemConstraintLink> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(HazardSystemConstraintLink, StpaBaseQuery.hazardSystemConstraintLink, dbConnector);
  }

  async removeAllByHazardId(projectId: string, hazardId: number): Promise<HazardSystemConstraintLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('hazardId').eq(hazardId).remove();
  }

  async removeAllBySystemConstraintId(
    projectId: string,
    systemConstraintId: number
  ): Promise<HazardSystemConstraintLink[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('systemConstraintId')
      .eq(systemConstraintId)
      .remove();
  }
}
