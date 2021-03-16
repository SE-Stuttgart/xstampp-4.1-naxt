import { Event } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class EventRepo extends Repository<Event> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(Event, CastBaseQuery.id, dbConnector);
  }
}
