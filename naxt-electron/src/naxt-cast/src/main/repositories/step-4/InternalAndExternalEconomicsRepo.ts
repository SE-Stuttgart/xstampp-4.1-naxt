import { InternalAndExternalEconomics } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class InternalAndExternalEconomicsRepo extends Repository<InternalAndExternalEconomics> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(InternalAndExternalEconomics, CastBaseQuery.id, dbConnector);
  }

  async exists(projectId: string, id: string): Promise<boolean> {
    return super._exists({ ...new InternalAndExternalEconomics(), projectId, id });
  }
}
