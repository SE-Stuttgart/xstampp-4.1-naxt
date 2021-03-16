import { Repository } from '@src-shared/rxdb-repository/Repository';
import { SubHazard } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class SubHazardRepo extends Repository<SubHazard> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(SubHazard, StpaBaseQuery.entityDependent, dbConnector);
  }

  public async exists(projectId: string, hazardId: number, id: number): Promise<boolean> {
    return super._exists({
      ...new SubHazard(),
      projectId,
      parentId: hazardId,
      id: id,
    });
  }

  public async removeAllByHazardId(projectId: string, hazardId: number): Promise<SubHazard[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('parentId').eq(hazardId).remove();
  }
}
