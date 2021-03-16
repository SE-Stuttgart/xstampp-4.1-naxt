import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ImplementationConstraint } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ImplementationConstraintRepo extends Repository<ImplementationConstraint> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ImplementationConstraint, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new ImplementationConstraint(),
      projectId,
      id: id,
    });
  }
}
