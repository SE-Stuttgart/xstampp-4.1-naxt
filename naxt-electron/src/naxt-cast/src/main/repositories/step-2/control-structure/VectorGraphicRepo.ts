import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';
import { VectorGraphic } from '@src-shared/control-structure/models';

@injectable()
export class VectorGraphicRepo extends Repository<VectorGraphic> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(VectorGraphic, CastBaseQuery.projectId, dbConnector);
  }

  public async find(projectId: string): Promise<VectorGraphic> {
    return super._find({ ...new VectorGraphic(), projectId: projectId });
  }
}
