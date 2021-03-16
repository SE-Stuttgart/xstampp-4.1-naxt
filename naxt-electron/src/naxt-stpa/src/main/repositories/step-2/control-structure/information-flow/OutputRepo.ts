import { Output } from '@src-shared/control-structure/models';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../../../StpaDBConnector';

@injectable()
export class OutputRepo extends Repository<Output> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(Output, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new Output(),
      projectId,
      id: id,
    });
  }
}
