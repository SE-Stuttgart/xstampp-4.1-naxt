import { InternalAndExternalEconomicsControllerLink } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class InternalAndExternalEconomicsControllerLinkRepo extends Repository<
  InternalAndExternalEconomicsControllerLink
> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(
      InternalAndExternalEconomicsControllerLink,
      CastBaseQuery.internalAndExternalEconomicsControllerLink,
      dbConnector
    );
  }

  public async removeAllForInternalAndExternalEconomicsId(
    projectId: string,
    internalAndExternalEconomicsId: string
  ): Promise<InternalAndExternalEconomicsControllerLink[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('internalAndExternalEconomicsId')
      .eq(internalAndExternalEconomicsId)
      .remove();
  }
}
