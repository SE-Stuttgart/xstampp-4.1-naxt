import { Repository } from '@src-shared/rxdb-repository/Repository';
import { Loss } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { StpaDBConnector } from '@stpa/src/main/repositories/StpaDBConnector';
import { inject, injectable } from 'inversify';

@injectable()
export class LossRepo extends Repository<Loss> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(Loss, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new Loss(),
      projectId,
      id: id,
    });
  }
}
