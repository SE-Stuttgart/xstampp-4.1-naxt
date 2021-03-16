import { Repository } from '@src-shared/rxdb-repository/Repository';
import { Responsibility } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ResponsibilityRepo extends Repository<Responsibility> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(Responsibility, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new Responsibility(),
      projectId,
      id: id,
    });
  }
}
