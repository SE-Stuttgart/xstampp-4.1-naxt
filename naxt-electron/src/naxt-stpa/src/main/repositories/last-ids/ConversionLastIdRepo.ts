import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ConversionLastId } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ConversionLastIdRepo extends Repository<ConversionLastId> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ConversionLastId, StpaBaseQuery.projectId, dbConnector);
  }

  public async nextId(projectId: string, actuatorId: number): Promise<number> {
    const collection = await this.getCollection();
    const document = await collection
      .findOne()
      .where('projectId')
      .eq(projectId)
      .where('actuatorId')
      .eq(actuatorId)
      .update({ $inc: { lastId: 1 } });

    if (!document) {
      await collection.insert({ projectId: projectId, actuatorId: actuatorId, lastId: 1 });
      return 1;
    }

    return document.lastId;
  }
}
