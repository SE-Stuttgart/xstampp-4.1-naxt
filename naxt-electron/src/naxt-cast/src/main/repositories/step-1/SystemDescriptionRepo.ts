import { Repository } from '@src-shared/rxdb-repository/Repository';
import { SystemDescription } from '../../models';
import { inject } from 'inversify';
import { CastDBConnector } from '../CastDbConnector';
import { CastBaseQuery } from '../CastBaseQuery';

export class SystemDescriptionRepo extends Repository<SystemDescription> {
  constructor(@inject(CastDBConnector) dbConnector: CastDBConnector) {
    super(SystemDescription, CastBaseQuery.projectId, dbConnector);
  }

  public async find(projectId: string): Promise<SystemDescription> {
    return super._find({ ...new SystemDescription(), projectId });
  }
}
