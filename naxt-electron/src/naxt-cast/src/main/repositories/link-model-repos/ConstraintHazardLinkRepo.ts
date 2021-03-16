import { ConstraintHazardLink } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class ConstraintHazardLinkRepo extends Repository<ConstraintHazardLink> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(ConstraintHazardLink, CastBaseQuery.constraintHazardLink, dbConnector);
  }

  public async removeAllForConstraintId(projectId: string, constraintId: string): Promise<ConstraintHazardLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('constraintId').eq(constraintId).remove();
  }
}
