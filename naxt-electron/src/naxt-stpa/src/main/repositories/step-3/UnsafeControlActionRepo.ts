import { Repository } from '@src-shared/rxdb-repository/Repository';
import { UnsafeControlAction } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class UnsafeControlActionRepo extends Repository<UnsafeControlAction> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(UnsafeControlAction, StpaBaseQuery.entityDependent, dbConnector);
  }

  public async exists(projectId: string, controlActionId: number, id: number): Promise<boolean> {
    return super._exists({
      ...new UnsafeControlAction(),
      projectId,
      parentId: controlActionId,
      id: id,
    });
  }

  public async removeAllByControlActionId(projectId: string, controlActionId: number): Promise<UnsafeControlAction[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('parentId').eq(controlActionId).remove();
  }
}
