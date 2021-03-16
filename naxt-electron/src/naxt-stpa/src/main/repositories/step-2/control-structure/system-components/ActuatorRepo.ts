import { Actuator } from '@src-shared/control-structure/models';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../../../StpaDBConnector';

@injectable()
export class ActuatorRepo extends Repository<Actuator> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(Actuator, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new Actuator(),
      projectId,
      id: id,
    });
  }
}
