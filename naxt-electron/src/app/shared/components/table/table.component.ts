import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { TableEntry } from '@src-shared/Interfaces';
import { BehaviorSubject } from 'rxjs';
import { FilterChip, FilterEntry } from '../filter-component/filter.types';
import { NaxtTableDataSource } from './table-data-source';
import { ColumnDefinition, NestedEmit, TableDeleteEmit } from './table.types';
import { RequiredModels, NestedModels } from '@stpa/index';
import { MessageService } from '@core/services/message/message.service';
import { KeyValuePair } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'naxt-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableComponent<T extends TableEntry> implements OnInit {
  activatedTableId: string = '';
  expandedTableId: string = '';

  get expandedRow(): T {
    return this.dataSource.data.find(row => row.tableId === this.expandedTableId);
  }
  get activatedRow(): T {
    return this.dataSource.data.find(row => row.tableId === this.activatedTableId);
  }

  nestedModels: NestedModels = { id: -1, name: '', modelLabel: '', nestedModels: [], parentId: -1 };
  @Input() detailRowTemplate: TemplateRef<any>;
  @Input() filterShowMenu: boolean = false;
  @Input() hideAdd: boolean = false;
  @Input() parent: string[] = [];
  @Input() menuList: FilterEntry[];
  @Input() menuMapList: RequiredModels;
  @Input() deleteObjects: string[];
  private _showStateColumn: boolean;
  @Input() set showStateColumn(v: boolean) {
    this._showStateColumn = v;

    let colDefs: string[] = this.columnDefinitions.filter(colDef => !colDef.hidden).map(colDef => colDef.key);
    if (v) colDefs = ['state', 'tableId', ...colDefs];
    if (this.showDeleteColumn) colDefs = [...colDefs, 'deleteColumn'];
    this.visibleColumns.next(colDefs);
  }

  get showStateColumn(): boolean {
    return this._showStateColumn;
  }

  private _showDeleteColumn: boolean;
  @Input() set showDeleteColumn(v: boolean) {
    this._showDeleteColumn = v;

    let colDefs: string[] = this.columnDefinitions.filter(colDef => !colDef.hidden).map(colDef => colDef.key);
    if (this.showStateColumn) colDefs = ['state', 'tableId', ...colDefs];
    if (v) colDefs = [...colDefs, 'deleteColumn'];
    this.visibleColumns.next(colDefs);
  }

  get showDeleteColumn(): boolean {
    return this._showDeleteColumn;
  }

  private _dataSource: NaxtTableDataSource<T>;

  @Input() set rowData(v: T[]) {
    if (!this._dataSource) this._dataSource = new NaxtTableDataSource<T>(v);
    // if data changes
    else this._dataSource.updateData(v);
  }

  get dataSource(): NaxtTableDataSource<T> {
    return this._dataSource;
  }

  visibleColumDefinitions: BehaviorSubject<ColumnDefinition[]> = new BehaviorSubject<ColumnDefinition[]>([]);
  visibleColumns: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private _columnDefinitions: ColumnDefinition[];
  @Input() set columnDefinitions(v: ColumnDefinition[]) {
    this._columnDefinitions = v;
    this.visibleColumDefinitions.next(v.filter(colDef => !colDef.hidden));

    let colDefs: string[] = v.filter(colDef => !colDef.hidden).map(colDef => colDef.key);
    if (this.showStateColumn) colDefs = ['state', 'tableId', ...colDefs];
    if (this.showDeleteColumn) colDefs = ['tableId', ...colDefs, 'deleteColumn'];
    this.visibleColumns.next(colDefs);
  }

  get columnDefinitions(): ColumnDefinition[] {
    return this._columnDefinitions;
  }

  get filterList(): FilterChip[] {
    return this.columnDefinitions
      .filter(ele => ele.searchable)
      .map(
        (colDef: ColumnDefinition) =>
          ({
            key: colDef.key,
            label: colDef.label,
            preSet: colDef.preSet,
            fixed: colDef.fixed,
            value: colDef.value,
            notOperator: colDef.operator === 'andnot' || colDef.operator === 'ornot',
            andOperator: colDef.operator === 'and' || colDef.operator === 'andnot',
            orOperator: colDef.operator === 'or' || colDef.operator === 'ornot',
          } as FilterChip)
      );
  }

  @Output() rowActivated: EventEmitter<T> = new EventEmitter<T>();
  @Output() rowExpanded: EventEmitter<T> = new EventEmitter<T>();
  @Output() rowCollapsed: EventEmitter<T> = new EventEmitter<T>();
  @Output() rowDelete: EventEmitter<TableDeleteEmit<T>> = new EventEmitter<TableDeleteEmit<T>>();
  @Output() addEmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() menuEmit: EventEmitter<FilterEntry> = new EventEmitter<FilterEntry>();
  @Output() menuMapEmit: EventEmitter<NestedEmit> = new EventEmitter<NestedEmit>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private readonly msg: MessageService, private readonly translate: TranslateService) {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  rowClickAction(row: T): void {
    this.activatedTableId =
      !!row && !!this.expandedRow && row.tableId === this.expandedRow.tableId ? undefined : row.tableId;
    if (!!this.activatedRow) this.rowActivated.emit(this.activatedRow);

    // for row expansion
    if (!!this.detailRowTemplate) {
      const tempRow = this.expandedRow;
      this.expandedTableId = this.activatedRow?.tableId;
      if (!!tempRow) this.rowCollapsed.emit(tempRow); // del opened row
      if (!!this.expandedRow) this.rowExpanded.emit(this.expandedRow); // add opened row
    }
  }

  public collapseRows(): void {
    if (!!this.expandedRow) this.rowClickAction(this.expandedRow);
  }

  shortenString(row: T, key: string): string {
    return row[key]?.length > 100 ? row[key].substr(0, 100).concat('...') : row[key];
  }

  scrollIntoView(): void {
    const elements = document.getElementsByClassName('expanded-row-detail');
    const element = elements[0];
    if (!!element) {
      const rect = element.getBoundingClientRect();
      if (
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom > (window.innerHeight || document.documentElement.clientHeight) ||
        rect.right > (window.innerWidth || document.documentElement.clientWidth)
      ) {
        elements[0].scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
    }
  }

  activateRowByPair(pair: KeyValuePair): void {
    if (!pair) return;
    const row = this._dataSource.data.find(row => row[pair.key] === pair.value);
    if (row && row !== this.activatedRow) this.rowClickAction(row);
  }

  deleteClickAction(event: MouseEvent, row: T): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.translate
      .get([
        'TABLE.DIALOG.HEADING',
        'TABLE.DIALOG.ACCEPT',
        'TABLE.DIALOG.DISMISS',
        'TABLE.DIALOG.TEXT1',
        'TABLE.DIALOG.TEXT2',
        'TABLE.DIALOG.TEXT3',
      ])
      .pipe(
        tap(res => {
          // { label: res['STPA.LOSSES.NAME'], key: 'name', searchable: true },
          // { label: 'Description', key: 'description', searchable: true, hidden: true },

          this.msg.dialog(
            {
              data: {
                acceptButtonText: res['TABLE.DIALOG.ACCEPT'],
                dismissButtonText: res['TABLE.DIALOG.DISMISS'],
                headline: res['TABLE.DIALOG.HEADING'],
                text: res['TABLE.DIALOG.TEXT1'] + row?.tableId + res['TABLE.DIALOG.TEXT2'],
                printObjects:
                  this?.deleteObjects?.length > 0 ? [res['TABLE.DIALOG.TEXT3'], ...this?.deleteObjects] : void 0,
              },
            },
            {
              accept: () =>
                this.rowDelete.emit({
                  row: row,
                  rows: this.dataSource.rows,
                }),
            }
          );
        })
      )
      .subscribe();
  }

  isExpanded(row: T): boolean {
    return !!this.expandedRow && row.tableId === this.expandedRow?.tableId;
  }

  updateTableFilter(searchList: FilterChip[]): void {
    this.dataSource.updateFilter(searchList);
  }
}
