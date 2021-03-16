import { Repository } from '@src-shared/rxdb-repository/Repository';
import { ProjectEntityLastId } from '@stpa/src/main/models';
import { StpaBaseQuery } from '@stpa/src/main/repositories/StpaBaseQuery';
import { inject, injectable } from 'inversify';
import { StpaDBConnector } from '../StpaDBConnector';

@injectable()
export class ProjectEntityLastIdRepo extends Repository<ProjectEntityLastId> {
  constructor(@inject(StpaDBConnector) dbConnector: StpaDBConnector) {
    super(ProjectEntityLastId, StpaBaseQuery.projectId, dbConnector);
  }

  public async nextId<T>(projectId: string, clazz: { new (): T }): Promise<number> {
    const collection = await this.getCollection();
    const document = await collection
      .findOne()
      .where('projectId')
      .eq(projectId)
      .where('entity')
      .eq(camelToSnakeCase(clazz.name))
      .update({ $inc: { lastId: 1 } });

    if (!document) {
      await collection.insert({ projectId: projectId, entity: camelToSnakeCase(clazz.name), lastId: 1 });
      return 1;
    }

    return document.lastId;
  }
}

function camelToSnakeCase(str: string): string {
  return str
    .replace(/[\w]([A-Z])/g, function (m) {
      return m[0] + '_' + m[1];
    })
    .toLowerCase();
}
