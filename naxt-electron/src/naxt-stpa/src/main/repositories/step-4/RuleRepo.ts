import { Repository } from '@src-shared/rxdb-repository/Repository';
import { Rule } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class RuleRepo extends Repository<Rule> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(Rule, StpaBaseQuery.entityDependent, dbConnector);
  }
}
