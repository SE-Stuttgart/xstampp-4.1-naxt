import { Repository } from '@src-shared/rxdb-repository/Repository';
import { SystemConstraint } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class SystemConstraintRepo extends Repository<SystemConstraint> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(SystemConstraint, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new SystemConstraint(),
      projectId,
      id: id,
    });
  }
}
