import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ProcessVariable } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../../StpaDBConnector';

@injectable()
export class ProcessVariableRepo extends Repository<ProcessVariable> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ProcessVariable, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new ProcessVariable(),
      projectId,
      id: id,
    });
  }
}
