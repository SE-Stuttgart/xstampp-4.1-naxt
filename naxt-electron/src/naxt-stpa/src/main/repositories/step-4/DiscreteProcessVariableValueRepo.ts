import { Repository } from '@src-shared/rxdb-repository/Repository';
import { DiscreteProcessVariableValue } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class DiscreteProcessVariableValueRepo extends Repository<DiscreteProcessVariableValue> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(DiscreteProcessVariableValue, StpaBaseQuery.projectId, dbConnector);
  }

  public async removeAllForProcessVariableId(projectId: string, processVariable: number): Promise<boolean> {
    const collection = await this.getCollection();
    await collection.find().where('projectId').eq(projectId).where('processVariableId').eq(processVariable).remove();
    return true;
  }
}
