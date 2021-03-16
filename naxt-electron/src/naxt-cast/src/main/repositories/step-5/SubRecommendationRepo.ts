import { SubRecommendation } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class SubRecommendationRepo extends Repository<SubRecommendation> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(SubRecommendation, CastBaseQuery.parentId, dbConnector);
  }

  public async removeAllForRecommendationId(projectId: string, recommendationId: string): Promise<boolean> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('parentId')
      .eq(recommendationId)
      .remove()
      .then(() => true);
  }
}
