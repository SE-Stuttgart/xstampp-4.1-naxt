import { Repository } from '@src-shared/rxdb-repository/Repository';
import { UnsafeControlActionHazardLink } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class UnsafeControlActionHazardLinkRepo extends Repository<UnsafeControlActionHazardLink> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(UnsafeControlActionHazardLink, StpaBaseQuery.unsafeControlActionHazardLink, dbConnector);
  }

  async removeAllByHazardId(projectId: string, hazardId: number): Promise<UnsafeControlActionHazardLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('hazardId').eq(hazardId).remove();
  }

  async removeAllByUnsafeControlActionId(
    projectId: string,
    controlActionId: number,
    unsafeControlActionId: number
  ): Promise<UnsafeControlActionHazardLink[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('controlActionId')
      .eq(controlActionId)
      .where('unsafeControlActionId')
      .eq(unsafeControlActionId)
      .remove();
  }
}
