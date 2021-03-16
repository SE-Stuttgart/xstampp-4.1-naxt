import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Output } from '@src-shared/control-structure/models';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class OutputRepo extends Repository<Output> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(Output, CastBaseQuery.idNumber, dbConnector);
  }
}
