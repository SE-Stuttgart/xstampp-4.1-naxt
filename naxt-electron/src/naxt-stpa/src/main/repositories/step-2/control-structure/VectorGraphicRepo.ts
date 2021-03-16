import { Repository } from '@src-shared/rxdb-repository/Repository';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { VectorGraphic } from '@src-shared/control-structure/models';
import { StpaDBConnector } from '../../StpaDBConnector';

@injectable()
export class VectorGraphicRepo extends Repository<VectorGraphic> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(VectorGraphic, StpaBaseQuery.projectId, dbConnector);
  }

  public async find(projectId: string): Promise<VectorGraphic> {
    return super._find({ ...new VectorGraphic(), projectId: projectId });
  }
}
