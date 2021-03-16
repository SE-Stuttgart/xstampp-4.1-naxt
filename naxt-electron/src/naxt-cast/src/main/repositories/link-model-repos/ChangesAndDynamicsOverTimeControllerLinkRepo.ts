import { ChangesAndDynamicsOverTimeControllerLink } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class ChangesAndDynamicsOverTimeControllerLinkRepo extends Repository<ChangesAndDynamicsOverTimeControllerLink> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(
      ChangesAndDynamicsOverTimeControllerLink,
      CastBaseQuery.changesAndDynamicsOverTimeControllerLink,
      dbConnector
    );
  }

  public async findAllByChangesAndDynamicsOverTimeId(
    projectId: string,
    changesAndDynamicsOverTimeId: string
  ): Promise<ChangesAndDynamicsOverTimeControllerLink[]> {
    const collection = await this.getCollection();
    const documents = await collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('changesAndDynamicsOverTimeId')
      .eq(changesAndDynamicsOverTimeId)
      .exec();
    return documents.map(this.map);
  }

  public async removeAllForChangesAndDynamicsOverTimeId(
    projectId: string,
    changesAndDynamicsOverTimeId: string
  ): Promise<ChangesAndDynamicsOverTimeControllerLink[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('changesAndDynamicsOverTimeId')
      .eq(changesAndDynamicsOverTimeId)
      .remove();
  }
}
