import { ControlAction } from '@src-shared/control-structure/models';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../../../StpaDBConnector';

@injectable()
export class ControlActionRepo extends Repository<ControlAction> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ControlAction, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new ControlAction(),
      projectId,
      id: id,
    });
  }
}
