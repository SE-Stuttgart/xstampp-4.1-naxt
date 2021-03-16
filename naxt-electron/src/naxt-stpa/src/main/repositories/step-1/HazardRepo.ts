import { Repository } from '@src-shared/rxdb-repository/Repository';
import { Hazard } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class HazardRepo extends Repository<Hazard> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(Hazard, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new Hazard(),
      projectId,
      id: id,
    });
  }
}
