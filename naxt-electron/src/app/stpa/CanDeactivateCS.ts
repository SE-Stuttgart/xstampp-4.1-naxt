import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StpaControlStructureComponent } from './stpa-control-structure/stpa-control-structure.component';
import { MessageService } from '@core/services';

@Injectable()
export class CanDeactivateCS implements CanDeactivate<StpaControlStructureComponent> {
  component: StpaControlStructureComponent;
  route: ActivatedRouteSnapshot;

  constructor(private readonly msg: MessageService) {}

  canDeactivate(
    component: StpaControlStructureComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!component.canDeactivate) this.msg.info('Please Save Controlstructure');
    return component.canDeactivate;
  }
}
