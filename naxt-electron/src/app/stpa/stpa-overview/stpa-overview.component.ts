import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AppNavigationService, MessageService } from '@core/index';
import { Subscriptions } from '@shared/index';
import { LinkedDocuments, SystemDescription, systemDescriptionController } from '@stpa/index';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'naxt-overview',
  templateUrl: './stpa-overview.component.html',
  styleUrls: ['./stpa-overview.component.scss'],
})
export class StpaOverviewComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();

  systemDescription: SystemDescription & LinkedDocuments;
  constructor(private msg: MessageService, private readonly navigationService: AppNavigationService) {}

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(p => {
          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          if (!!p?.projectId) {
            this.initDataSubscriptions();
          } else {
            setTimeout(() => {
              this.initDataSubscriptions();
            }, 1000);
          }
        })
      )
      .subscribe();
  }

  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = systemDescriptionController
      .get$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.systemDescription = v;
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
    systemDescriptionController.update(this.systemDescription);
  }
}
