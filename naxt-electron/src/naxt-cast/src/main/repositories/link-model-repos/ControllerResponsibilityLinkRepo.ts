import { ControllerResponsibilityLink } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class ControllerResponsibilityLinkRepo extends Repository<ControllerResponsibilityLink> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(ControllerResponsibilityLink, CastBaseQuery.controllerResponsibilityLink, dbConnector);
  }

  public async removeAllForResponsibilityId(
    projectId: string,
    responsibilityId: string
  ): Promise<ControllerResponsibilityLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('responsibilityId').eq(responsibilityId).remove();
  }
}
