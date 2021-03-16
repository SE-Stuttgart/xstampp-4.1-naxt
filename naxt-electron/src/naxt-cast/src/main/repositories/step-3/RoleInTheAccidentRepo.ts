import { RoleInTheAccident } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { InformationFlowType, SystemComponentType } from '@src-shared/Enums';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class RoleInTheAccidentRepo extends Repository<RoleInTheAccident> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(RoleInTheAccident, CastBaseQuery.id, dbConnector);
  }

  public async removeByComponentId(
    projectId: string,
    componentId: number,
    componentType: SystemComponentType | InformationFlowType
  ): Promise<RoleInTheAccident[]> {
    const collection = await this.getCollection();
    return collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('componentType')
      .eq(componentType)
      .where('componentId')
      .eq(componentId)
      .remove();
  }
}
