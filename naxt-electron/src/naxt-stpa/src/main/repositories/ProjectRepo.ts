import { UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from './StpaDBConnector';

@injectable()
export class ProjectRepo extends Repository<Project> implements UnchangedSavesSetter {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(Project, StpaBaseQuery.projectId, dbConnector);
  }

  public async exists(projectId: string): Promise<boolean> {
    return super._exists({ ...new Project(), projectId });
  }

  public async setUnsavedChanges(projectId: string, unsavedChanges: boolean): Promise<void> {
    const collection = await this.getCollection();
    await collection
      .findOne()
      .where('projectId')
      .eq(projectId)
      .update({ $set: { unsavedChanges: unsavedChanges } });
  }
}
