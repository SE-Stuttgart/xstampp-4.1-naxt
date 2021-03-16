import { Repository } from '@src-shared/rxdb-repository/Repository';
import { RuleLastId } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class RuleLastIdRepo extends Repository<RuleLastId> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(RuleLastId, StpaBaseQuery.projectId, dbConnector);
  }

  public async nextId(projectId: string, controllerId: number): Promise<number> {
    const collection = await this.getCollection();
    const document = await collection
      .findOne()
      .where('projectId')
      .eq(projectId)
      .where('controllerId')
      .eq(controllerId)
      .update({ $inc: { lastId: 1 } });

    if (!document) {
      await collection.insert({ projectId: projectId, controllerId: controllerId, lastId: 1 });
      return 1;
    }

    return document.lastId;
  }
}
