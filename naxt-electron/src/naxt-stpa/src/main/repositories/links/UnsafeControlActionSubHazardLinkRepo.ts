import { Repository } from '@src-shared/rxdb-repository/Repository';
import { UnsafeControlActionHazardLink, UnsafeControlActionSubHazardLink } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class UnsafeControlActionSubHazardLinkRepo extends Repository<UnsafeControlActionSubHazardLink> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(UnsafeControlActionSubHazardLink, StpaBaseQuery.unsafeControlActionSubHazardLink, dbConnector);
  }

  async removeAllBySubHazardId(
    projectId: string,
    hazardId: number,
    subHazardId: number
  ): Promise<UnsafeControlActionHazardLink[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('hazardId')
      .eq(hazardId)
      .where('subHazardId')
      .eq(subHazardId)
      .remove();
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
