import { Repository } from '@src-shared/rxdb-repository/Repository';
import { SubSystemConstraintLastId } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class SubSystemConstraintLastIdRepo extends Repository<SubSystemConstraintLastId> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(SubSystemConstraintLastId, StpaBaseQuery.projectId, dbConnector);
  }

  public async nextId(projectId: string, systemConstraintId: number): Promise<number> {
    const collection = await this.getCollection();
    const document = await collection
      .findOne()
      .where('projectId')
      .eq(projectId)
      .where('systemConstraintId')
      .eq(systemConstraintId)
      .update({ $inc: { lastId: 1 } });

    if (!document) {
      await collection.insert({ projectId: projectId, systemConstraintId: systemConstraintId, lastId: 1 });
      return 1;
    }

    return document.lastId;
  }
}
