import { SafetyInformationSystemControllerLink } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class SafetyInformationSystemControllerLinkRepo extends Repository<SafetyInformationSystemControllerLink> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(SafetyInformationSystemControllerLink, CastBaseQuery.safetyInformationSystemControllerLink, dbConnector);
  }

  public async removeAllForSafetyInformationId(
    projectId: string,
    safetyInformationSystemId: string
  ): Promise<SafetyInformationSystemControllerLink[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('safetyInformationSystemId')
      .eq(safetyInformationSystemId)
      .remove();
  }
}
