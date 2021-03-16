import { Repository } from '@src-shared/rxdb-repository/Repository';
import { UnsafeControlActionLastId } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class UnsafeControlActionLastIdRepo extends Repository<UnsafeControlActionLastId> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(UnsafeControlActionLastId, StpaBaseQuery.projectId, dbConnector);
  }

  public async nextId(projectId: string, controlActionId: number): Promise<number> {
    const collection = await this.getCollection();
    const document = await collection
      .findOne()
      .where('projectId')
      .eq(projectId)
      .where('controlActionId')
      .eq(controlActionId)
      .update({ $inc: { lastId: 1 } });

    if (!document) {
      await collection.insert({ projectId: projectId, controlActionId: controlActionId, lastId: 1 });
      return 1;
    }

    return document.lastId;
  }
}
