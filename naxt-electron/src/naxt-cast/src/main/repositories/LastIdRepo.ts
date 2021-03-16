import { LastIdEntry } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';
import { CastDBConnector } from './CastDbConnector';

@injectable()
export class LastIdRepo extends Repository<LastIdEntry> {
  constructor(@inject(CastDBConnector) dbConnector: CastDBConnector) {
    super(LastIdEntry, CastBaseQuery.projectId, dbConnector);
  }

  public async nextId<T>(projectId: string, clazz: { new (): T }, dependsOn?: string): Promise<number> {
    const _dependsOn = dependsOn ? dependsOn : 'self';
    const collection = await this.getCollection();
    const document = await collection
      .findOne()
      .where('projectId')
      .eq(projectId)
      .where('entry')
      .eq(clazz.name)
      .where('dependentsOn')
      .where(_dependsOn)
      .update({ $inc: { lastId: 1 } });

    if (!document) {
      await collection.insert({ projectId: projectId, entry: clazz.name, dependentsOn: _dependsOn, lastId: 1 });
      return 1;
    }

    return document.lastId;
  }
}
