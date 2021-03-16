import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ProcessModelProcessVariableLink } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ProcessModelProcessVariableLinkRepo extends Repository<ProcessModelProcessVariableLink> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ProcessModelProcessVariableLink, StpaBaseQuery.processModelProcessVariableLink, dbConnector);
  }

  async removeAllByProcessVariableId(
    projectId: string,
    processVariableId: number
  ): Promise<ProcessModelProcessVariableLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('processVariableId').eq(processVariableId).remove();
  }

  async removeAllByProcessModelId(
    projectId: string,
    processModelId: number
  ): Promise<ProcessModelProcessVariableLink[]> {
    const collection = await this.getCollection();
    return collection.find().where('projectId').eq(projectId).where('processModelId').eq(processModelId).remove();
  }
}
