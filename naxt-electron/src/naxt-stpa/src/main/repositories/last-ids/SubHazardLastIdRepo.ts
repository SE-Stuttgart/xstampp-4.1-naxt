import { Repository } from '@src-shared/rxdb-repository/Repository';
import { SubHazardLastId } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class SubHazardLastIdRepo extends Repository<SubHazardLastId> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(SubHazardLastId, StpaBaseQuery.projectId, dbConnector);
  }

  public async nextId(projectId: string, hazardId: number): Promise<number> {
    const collection = await this.getCollection();
    const document = await collection
      .findOne()
      .where('projectId')
      .eq(projectId)
      .where('hazardId')
      .eq(hazardId)
      .update({ $inc: { lastId: 1 } });

    if (!document) {
      await collection.insert({ projectId: projectId, hazardId: hazardId, lastId: 1 });
      return 1;
    }

    return document.lastId;
  }
}
