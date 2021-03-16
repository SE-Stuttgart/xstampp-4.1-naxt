import { ChangesAndDynamicsOverTime } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class ChangesAndDynamicsOverTimeRepo extends Repository<ChangesAndDynamicsOverTime> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(ChangesAndDynamicsOverTime, CastBaseQuery.id, dbConnector);
  }

  async exists(projectId: string, id: string): Promise<boolean> {
    return super._exists({ ...new ChangesAndDynamicsOverTime(), projectId, id });
  }
}
