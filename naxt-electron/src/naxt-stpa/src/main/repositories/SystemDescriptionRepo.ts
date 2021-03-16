import { Repository } from '@src-shared/rxdb-repository/Repository';
import { LinkedDocuments, SystemDescription } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { StpaDBConnector } from './StpaDBConnector';

@injectable()
export class SystemDescriptionRepo extends Repository<SystemDescription> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(SystemDescription, StpaBaseQuery.projectId, dbConnector);
  }

  public async find(projectId: string): Promise<SystemDescription> {
    return super._find({ ...new SystemDescription(), projectId });
  }
}

@injectable()
export class LinkedDocumentsRepo extends Repository<LinkedDocuments> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(LinkedDocuments, StpaBaseQuery.projectId, dbConnector);
  }

  find$(projectId: string): Observable<LinkedDocuments | null> {
    return super._find$({ ...new LinkedDocuments(), projectId });
  }

  public async find(projectId: string): Promise<LinkedDocuments> {
    return super._find({ ...new LinkedDocuments(), projectId });
  }
}
