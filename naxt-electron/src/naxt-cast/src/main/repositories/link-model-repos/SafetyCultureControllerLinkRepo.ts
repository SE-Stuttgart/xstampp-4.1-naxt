import { SafetyCultureControllerLink } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class SafetyCultureControllerLinkRepo extends Repository<SafetyCultureControllerLink> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(SafetyCultureControllerLink, CastBaseQuery.safetyCultureControllerLink, dbConnector);
  }

  public async removeAllForSafetyCultureId(
    projectId: string,
    safetyCultureId: string
  ): Promise<SafetyCultureControllerLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('safetyCultureId').eq(safetyCultureId).remove();
  }
}
