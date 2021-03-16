import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, Subscriptions, TableComponent, UpdateTiming } from '@shared/index';
import { auditTime, tap } from 'rxjs/operators';
import { Recommendation, subRecommendationController, SubRecommendationTableModel } from '@cast/index';

@Component({
  selector: 'naxt-cast-sub-recommondations',
  templateUrl: './cast-sub-recommondations.component.html',
  styleUrls: ['./cast-sub-recommondations.component.scss'],
})
export class CastSubRecommondationsComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();

  @ViewChild(TableComponent) table: TableComponent<SubRecommendationTableModel>;
  subRecommendationsData: SubRecommendationTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = false;

  menuList: Recommendation[] = [];

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = subRecommendationController
      .getPossibleParentRecommendations$(this.navigationService.currentPoint.projectId)
      .pipe(
        auditTime(UpdateTiming.REGUALR),
        tap(v => {
          this.menuList = v;
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(subRecommendation => {
          this.navigationService.setNewKeyValue(new KeyValuePair(subRecommendation.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(subRecommendation => {
          subRecommendationController
            .updateSubRecommendation(subRecommendation)
            .catch((err: Error) => this.msg.info(err.message));
          this.navigationService.setNewKeyValue(undefined);

          if (this.shouldCreateNew) {
            this.shouldCreateNew = false;
            this.backendCreate(this.chosenRecommendation);
          }
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowDelete
      .pipe(
        tap(subRecommendation => {
          subRecommendationController
            .removeSubRecommendation(subRecommendation.row)
            .catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            subRecommendationController
              .updateSubRecommendation(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = subRecommendationController
      .getAll$(this.navigationService.currentPoint.projectId)
      .pipe(
        auditTime(UpdateTiming.REGUALR),
        tap(v => {
          this.subRecommendationsData = v;

          // opens selecten row if needed
          if (this.firstLoad) {
            this.firstLoad = false;
            if (this.table?.expandedRow?.tableId !== this.navigationService.currentPoint.keyValuePair?.value)
              setTimeout(() => {
                this.table.activateRowByPair(this.navigationService.currentPoint.keyValuePair);
              }, ExpandTimings.REGULAR);
          }

          if (this.shouldFocus) {
            this.shouldFocus = false;
            setTimeout(() => this.table.activateRowByPair({ key: 'name', value: '' }), ExpandTimings.REGULAR);
          }
        })
      )
      .subscribe();
  }
  chosenRecommendation: Recommendation;
  createSubRecommendations(event): void {
    this.chosenRecommendation = event;
    if (
      this.shouldCreateNew ||
      this.subRecommendationsData.filter(
        subRecommendation => !subRecommendation?.name && subRecommendation.name.length <= 0
      )?.length > 0
    )
      return;
    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate(this.chosenRecommendation);
  }

  backendCreate(chosenRecommendation: Recommendation): void {
    this.shouldFocus = true;
    subRecommendationController
      .createSubRecommendation(this.navigationService.currentPoint.projectId, chosenRecommendation.id)
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow) subRecommendationController.updateSubRecommendation(this.table.expandedRow);
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.SUBRECOMMENDATIONS.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['CAST.SUBRECOMMENDATIONS.NAME', 'CAST.SUBRECOMMENDATIONS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.SUBRECOMMENDATIONS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
