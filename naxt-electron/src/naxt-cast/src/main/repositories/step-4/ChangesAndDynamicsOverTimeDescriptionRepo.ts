import { ChangesAndDynamicsOverTimeDescription } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class ChangesAndDynamicsOverTimeDescriptionRepo extends Repository<ChangesAndDynamicsOverTimeDescription> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(ChangesAndDynamicsOverTimeDescription, CastBaseQuery.projectId, dbConnector);
  }

  public async find(projectId: string): Promise<ChangesAndDynamicsOverTimeDescription> {
    return super._find({ ...new ChangesAndDynamicsOverTimeDescription(), projectId });
  }
}
