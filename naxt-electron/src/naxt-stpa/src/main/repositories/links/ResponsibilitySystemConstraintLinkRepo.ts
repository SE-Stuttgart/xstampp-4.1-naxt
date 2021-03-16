import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ResponsibilitySystemConstraintLink } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ResponsibilitySystemConstraintLinkRepo extends Repository<ResponsibilitySystemConstraintLink> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ResponsibilitySystemConstraintLink, StpaBaseQuery.responsibilitySystemConstraintLink, dbConnector);
  }

  async removeAllBySystemConstraintId(
    projectId: string,
    systemConstraintId: number
  ): Promise<ResponsibilitySystemConstraintLink[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('systemConstraintId')
      .eq(systemConstraintId)
      .remove();
  }

  async removeAllByResponsibilityId(
    projectId: string,
    responsibilityId: number
  ): Promise<ResponsibilitySystemConstraintLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('responsibilityId').eq(responsibilityId).remove();
  }
}
