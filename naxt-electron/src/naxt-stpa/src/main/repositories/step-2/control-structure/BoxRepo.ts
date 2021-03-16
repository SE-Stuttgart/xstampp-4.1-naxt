import { Box } from '@src-shared/control-structure/models';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../../StpaDBConnector';

@injectable()
export class BoxRepo extends Repository<Box> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(Box, StpaBaseQuery.idString, dbConnector);
  }
}
