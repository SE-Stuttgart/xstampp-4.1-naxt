import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AppNavigationService, MessageService } from '@core/index';
import { Subscriptions } from '@shared/index';
import { tap } from 'rxjs/operators';
import { systemDescriptionController, SystemDescription } from '@cast/index';

@Component({
  selector: 'naxt-cast-overview',
  templateUrl: './cast-overview.component.html',
  styleUrls: ['./cast-overview.component.scss'],
})
export class CastOverviewComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  systemDescription: SystemDescription;
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

  // dialog(): void {
  //   this.msg.dialog(
  //     {
  //       data: {
  //         headline: 'Projekt erstellen',
  //         text: 'Bitte gib den Projektnamen an:',
  //         inputLabel: 'TestLabel',
  //       },
  //     },
  //     {
  //       accept: (extra: string) => console.log(extra),
  //     }
  //   );
  // }

  save(): void {
    systemDescriptionController.update(this.systemDescription);
  }

  // bottomSheet(): void {
  //   this.msg.bottomSheet(
  //     {
  //       data: {
  //         headline: 'Test',
  //         headline1: 'H1',
  //         headline2: 'H2',
  //         headline3: 'H3',
  //         liste1: this.ELEMENT_DATA,
  //         liste2: this.ELEMENT_DATA,
  //         liste3: this.ELEMENT_DATA,
  //       },
  //     },
  //     {
  //       accept: result => console.log(result),
  //     }
  //   );
  // }
}
