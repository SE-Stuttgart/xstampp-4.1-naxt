import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Sensor } from '@src-shared/control-structure/models';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class SensorRepo extends Repository<Sensor> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(Sensor, CastBaseQuery.idNumber, dbConnector);
  }
}
