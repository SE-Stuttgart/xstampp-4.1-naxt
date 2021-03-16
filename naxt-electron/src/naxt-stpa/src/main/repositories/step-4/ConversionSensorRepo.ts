import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ConversionSensor } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ConversionSensorRepo extends Repository<ConversionSensor> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ConversionSensor, StpaBaseQuery.entityDependent, dbConnector);
  }
}
