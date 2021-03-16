import { ProcessVariable } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class ProcessVariableRepo extends Repository<ProcessVariable> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(ProcessVariable, CastBaseQuery.id, dbConnector);
  }
}
