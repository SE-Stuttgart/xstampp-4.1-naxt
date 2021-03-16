import { Repository } from '@src-shared/rxdb-repository/Repository';
import { Conversion } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ConversionRepo extends Repository<Conversion> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(Conversion, StpaBaseQuery.entityDependent, dbConnector);
  }
}
