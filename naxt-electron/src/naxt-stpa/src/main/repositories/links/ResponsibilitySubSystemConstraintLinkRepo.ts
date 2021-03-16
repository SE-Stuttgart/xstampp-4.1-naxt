import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ResponsibilitySubSystemConstraintLink } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ResponsibilitySubSystemConstraintLinkRepo extends Repository<ResponsibilitySubSystemConstraintLink> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ResponsibilitySubSystemConstraintLink, StpaBaseQuery.responsibilitySubSystemConstraintLink, dbConnector);
  }

  async removeAllByResponsibilityId(
    projectId: string,
    responsibilityId: number
  ): Promise<ResponsibilitySubSystemConstraintLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('responsibilityId').eq(responsibilityId).remove();
  }

  async removeAllBySubSystemConstraintId(
    projectId: string,
    systemConstraintId: number,
    subSystemConstraintId: number
  ): Promise<ResponsibilitySubSystemConstraintLink[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('systemConstraintId')
      .eq(systemConstraintId)
      .where('subSystemConstraintId')
      .eq(subSystemConstraintId)
      .remove();
  }
}
