import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AccidentDescription, accidentDescriptionController } from '@cast/index';
import { AppNavigationService, MessageService } from '@core/index';
import { Subscriptions } from '@shared/index';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'naxt-cast-accident-description',
  templateUrl: './cast-accident-description.component.html',
  styleUrls: ['./cast-accident-description.component.scss'],
})
export class CastAccidentDescriptionComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();

  accidentDescription: AccidentDescription;
  constructor(private msg: MessageService, private readonly navigationService: AppNavigationService) {}

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = accidentDescriptionController
      .get$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.accidentDescription = v;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.dataSubscriptions.unsubscribe();
    this.save();
  }

  save(): void {
    accidentDescriptionController.update(this.accidentDescription);
  }
}
