import { EventService } from '@cast/src/main/services';
import { EventTableModel } from '@cast/src/main/services/models/table-models/step-1/EventTableModel';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';
import { Event } from '../../models';

@injectable()
export class EventController {
  constructor(@inject(EventService) private readonly eventService: EventService) {}

  public async create(projectId: string): Promise<Event> {
    return this.eventService.create({ ...new Event(), projectId });
  }

  public getAll$(projectId: string): Observable<EventTableModel[]> {
    return this.eventService.getAllTableModels$(projectId);
  }

  public async update(event: Event): Promise<Event> {
    return this.eventService.update(event);
  }

  public async remove(event: Event): Promise<boolean> {
    return this.eventService.remove(event);
  }
}
