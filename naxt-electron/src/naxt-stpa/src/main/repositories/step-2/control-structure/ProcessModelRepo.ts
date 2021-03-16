import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ProcessModel } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../../StpaDBConnector';

@injectable()
export class ProcessModelRepo extends Repository<ProcessModel> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ProcessModel, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new ProcessModel(),
      projectId,
      id: id,
    });
  }
}
