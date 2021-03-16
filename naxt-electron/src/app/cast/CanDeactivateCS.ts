import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from '@core/services';
import { CastControlStructureComponent } from './cast-control-structure/cast-control-structure.component';

@Injectable()
export class CanDeactivateCS implements CanDeactivate<CastControlStructureComponent> {
  component: CastControlStructureComponent;
  route: ActivatedRouteSnapshot;

  constructor(private readonly msg: MessageService) {}

  canDeactivate(
    component: CastControlStructureComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!component.canDeactivate) this.msg.info('Please Save Controlstructure');
    return component.canDeactivate;
  }
}
