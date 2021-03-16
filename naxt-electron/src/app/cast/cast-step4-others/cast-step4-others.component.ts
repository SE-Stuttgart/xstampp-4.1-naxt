import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscriptions } from '@shared/index';
import { AppNavigationService, MessageService } from '@core/index';
import { tap } from 'rxjs/operators';
import { importExportController, OtherFactors, otherFactorsController } from '@cast/index';

@Component({
  selector: 'naxt-cast-step4-others',
  templateUrl: './cast-step4-others.component.html',
  styleUrls: ['./cast-step4-others.component.scss'],
})
export class CastStep4OthersComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  private firstLoad: boolean = false;

  otherFactors: OtherFactors;
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

    importExportController.export(this.navigationService.currentPoint.projectId).then(console.log);
  }

  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = otherFactorsController
      .get$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.otherFactors = v;
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
    otherFactorsController.update(this.otherFactors);
  }
}
