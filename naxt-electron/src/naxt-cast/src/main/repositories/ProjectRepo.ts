import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';
import { CastDBConnector } from './CastDbConnector';

@injectable()
export class ProjectRepo extends Repository<Project> implements UnchangedSavesSetter {
  constructor(@inject(CastDBConnector) dbConnector: CastDBConnector) {
    super(Project, CastBaseQuery.projectId, dbConnector);
  }

  public async exists(projectId: string): Promise<boolean> {
    return super._exists({ ...new Project(), projectId });
  }

  public async setUnsavedChanges(projectId: string, unsavedChanges: boolean): Promise<void> {
    const collection = await this.getCollection();
    try {
      await collection
        .findOne()
        .where('projectId')
        .eq(projectId)
        .update({ $set: { unsavedChanges: unsavedChanges } });
    } catch (err) {
      // ignore pouchdb conflict 409
      if (err.name === 'RxError (COL19)') {
        // console.error(err);
        console.log('SetUnsavedChanges conflict.');
      } else throw err;
    }
  }
}
