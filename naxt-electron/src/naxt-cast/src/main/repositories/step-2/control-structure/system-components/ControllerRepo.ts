import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Controller } from '@src-shared/control-structure/models';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class ControllerRepo extends Repository<Controller> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(Controller, CastBaseQuery.idNumber, dbConnector);
  }

  async exists(projectId: string, id: number): Promise<boolean> {
    return super._exists({ ...new Controller(), projectId, id });
  }
}
