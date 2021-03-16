import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Feedback } from '@src-shared/control-structure/models';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class FeedbackRepo extends Repository<Feedback> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(Feedback, CastBaseQuery.idNumber, dbConnector);
  }
}
