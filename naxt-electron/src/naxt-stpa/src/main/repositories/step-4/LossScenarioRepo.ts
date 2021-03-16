import { Repository } from '@src-shared/rxdb-repository/Repository';
import { LossScenario } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class LossScenarioRepo extends Repository<LossScenario> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(LossScenario, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new LossScenario(),
      projectId,
      id: id,
    });
  }
}
