import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ControllerConstraint } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ControllerConstraintRepo extends Repository<ControllerConstraint> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ControllerConstraint, StpaBaseQuery.entityDependent, dbConnector);
  }

  public async removeAllByUnsafeControlActionId(
    projectId: string,
    controlActionId: number,
    unsafeControlActionId: number
  ): Promise<ControllerConstraint[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('parentId')
      .eq(controlActionId)
      .where('id')
      .eq(unsafeControlActionId)
      .remove();
  }
}
