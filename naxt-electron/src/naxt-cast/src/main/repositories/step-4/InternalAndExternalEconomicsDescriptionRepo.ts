import { InternalAndExternalEconomicsDescription } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class InternalAndExternalEconomicsDescriptionRepo extends Repository<InternalAndExternalEconomicsDescription> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(InternalAndExternalEconomicsDescription, CastBaseQuery.projectId, dbConnector);
  }

  public async find(projectId: string): Promise<InternalAndExternalEconomicsDescription> {
    return super._find({ ...new InternalAndExternalEconomicsDescription(), projectId });
  }
}
