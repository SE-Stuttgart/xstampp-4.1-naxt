import { EventRepo, LastIdRepo, ProjectRepo } from '@cast/src/main/repositories';
import { Service } from '@cast/src/main/services/common/Service';
import { EventTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../../models';

@injectable()
export class EventService extends Service<Event> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(EventRepo) private readonly eventRepo: EventRepo
  ) {
    super(Event, projectRepo, eventRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<EventTableModel[]> {
    return combineLatest([this.getAll$(projectId)]).pipe(
      map(([events]) => {
        return events.map(event => new EventTableModel(event, []));
      })
    );
  }
}
