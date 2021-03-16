import { Repository } from '@src-shared/rxdb-repository/Repository';
import { SubSystemConstraint } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class SubSystemConstraintRepo extends Repository<SubSystemConstraint> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(SubSystemConstraint, StpaBaseQuery.entityDependent, dbConnector);
  }

  public async exists(projectId: string, systemConstraint: number, id: number): Promise<boolean> {
    return super._exists({
      ...new SubSystemConstraint(),
      projectId,
      parentId: systemConstraint,
      id: id,
    });
  }

  public async removeAllBySubHazardId(
    projectId: string,
    hazardId: number,
    subHazardId: number
  ): Promise<SubSystemConstraint[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('hazardId')
      .eq(hazardId)
      .where('subHazardId')
      .eq(subHazardId)
      .remove();
  }

  public async removeAllBySystemConstraintId(
    projectId: string,
    systemConstraintId: number
  ): Promise<SubSystemConstraint[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('parentId').eq(systemConstraintId).remove();
  }
}
