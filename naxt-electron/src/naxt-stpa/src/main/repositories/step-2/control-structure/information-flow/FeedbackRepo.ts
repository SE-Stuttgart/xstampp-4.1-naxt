import { Feedback } from '@src-shared/control-structure/models';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../../../StpaDBConnector';

@injectable()
export class FeedbackRepo extends Repository<Feedback> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(Feedback, StpaBaseQuery.projectDependent, dbConnector);
  }

  public async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({
      ...new Feedback(),
      projectId,
      id: id,
    });
  }
}
