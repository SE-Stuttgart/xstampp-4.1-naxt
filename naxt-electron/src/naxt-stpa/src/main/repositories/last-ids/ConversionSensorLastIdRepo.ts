import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ConversionSensorLastId } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ConversionSensorLastIdRepo extends Repository<ConversionSensorLastId> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ConversionSensorLastId, StpaBaseQuery.projectId, dbConnector);
  }

  public async nextId(projectId: string, sensorId: number): Promise<number> {
    const collection = await this.getCollection();
    const document = await collection
      .findOne()
      .where('projectId')
      .eq(projectId)
      .where('sensorId')
      .eq(sensorId)
      .update({ $inc: { lastId: 1 } });

    if (!document) {
      await collection.insert({ projectId: projectId, sensorId: sensorId, lastId: 1 });
      return 1;
    }

    return document.lastId;
  }
}
