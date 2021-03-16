import { SafetyManagementSystemControllerLink } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class SafetyManagementSystemControllerLinkRepo extends Repository<SafetyManagementSystemControllerLink> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(SafetyManagementSystemControllerLink, CastBaseQuery.safetyManagementSystemControllerLink, dbConnector);
  }

  public async removeAllForSafetyManagementId(
    projectId: string,
    safetyManagementSystemId: string
  ): Promise<SafetyManagementSystemControllerLink[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('safetyManagementSystemId')
      .eq(safetyManagementSystemId)
      .remove();
  }
}
