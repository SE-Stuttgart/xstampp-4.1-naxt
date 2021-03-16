import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Actuator } from '@src-shared/control-structure/models';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class ActuatorRepo extends Repository<Actuator> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(Actuator, CastBaseQuery.idNumber, dbConnector);
  }
}
