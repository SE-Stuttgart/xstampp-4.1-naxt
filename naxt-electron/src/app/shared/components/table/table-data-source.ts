import { MatTableDataSource } from '@angular/material/table';
import { FilterChip } from '../filter-component/filter.types';
import { BehaviorSubject } from 'rxjs';
import { Subscriptions } from '../../utils/subscriptions';
import { tap } from 'rxjs/operators';
import { EntityState } from './table.types';
import { MatSort } from '@angular/material/sort';

export class NaxtTableDataSource<T> extends MatTableDataSource<T> {
  private readonly originalList: T[];
  private filterSubject: BehaviorSubject<FilterChip[]>;
  private subscriptions: Subscriptions = new Subscriptions();

  constructor(data: T[]) {
    super(data);
    this.originalList = data;
    this._initFilterObserver();
  }

  get rows(): T[] {
    return this.data;
  }

  updateData(data: T[]): void {
    this.originalList.splice(0, this.originalList.length); // clear list
    this.originalList.push(...data); // insert new data
    this._refreshFilter(); // refresh filter for new data
  }

  _compareFn = new Intl.Collator('en', { sensitivity: 'base', numeric: true }).compare;
  sortData: (data: T[], sort: MatSort) => T[] = (data: T[], sort: MatSort): T[] => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction == '') {
      return data;
    }

    return data.sort((a, b) => {
      const valueA = this.sortingDataAccessor(a, active);
      const valueB = this.sortingDataAccessor(b, active);

      const comparatorResult = this._compareFn(valueA as string, valueB as string);

      return comparatorResult * (direction == 'asc' ? 1 : -1);
    });
  };

  /**
   * define custom sorts here
   */
  sortingDataAccessor = (data: T, sortHeaderId: string): string | number => {
    switch (sortHeaderId) {
      // custom sort for state column
      case 'state': {
        switch (data[sortHeaderId]) {
          case EntityState.TODO:
            return 1;
          case EntityState.DOING:
            return 2;
          case EntityState.DONE:
            return 3;
          default:
            return -1;
        }
      }
    }
    return data[sortHeaderId];
  };

  updateFilter(filterList: FilterChip[]): void {
    this.filterSubject.next(filterList);
  }

  private _refreshFilter(): void {
    this.filterSubject.next(this.filterSubject.value);
  }

  private _initFilterObserver(): void {
    this.filterSubject = new BehaviorSubject<FilterChip[]>([]);
    this.subscriptions.plusOne = this.filterSubject.pipe(tap(s => this._addNewFilter(s))).subscribe();
  }

  private _addNewFilter(filterList: FilterChip[]): void {
    let tempList: T[] = this.originalList;

    filterList.forEach((ele, index) => {
      if (index === 0) {
        tempList = tempList.filter(s => this._filterKey(s[ele.key], ele.value, ele.notOperator));
      } else {
        if (ele.andOperator) tempList = tempList.filter(s => this._filterKey(s[ele.key], ele.value, ele.notOperator));
        if (ele.orOperator)
          tempList = this._mergeOrList(
            tempList,
            this.originalList.filter(s => this._filterKey(s[ele.key], ele.value, ele.notOperator))
          );
      }
    });

    this.data = tempList;
  }

  // we could do this fancy with the filterPredicate ?
  private _filterKey(key: string | number | boolean, value: string, notOperator: boolean): boolean {
    value = value.trim().toLocaleLowerCase();
    switch (typeof key) {
      case 'string': {
        if (!value || value.length <= 0) return true;
        return notOperator
          ? !key.trim().toLocaleLowerCase().includes(value)
          : key.trim().toLocaleLowerCase().includes(value);
      }
      case 'number': {
        if (!value || value.length <= 0) return true;
        return notOperator
          ? !key.toString().trim().toLocaleLowerCase().includes(value)
          : key.toString().trim().toLocaleLowerCase().includes(value);
      }
      case 'boolean': {
        return key;
      }
      default:
        return true;
    }
  }

  /**
   * Merges 2 lists and delets dublicated entries
   * @param list1 first list
   * @param list2 second list
   */
  private _mergeOrList(list1: T[], list2: T[]): T[] {
    // sadly the beautifull solution with set has abysmal performance -.-
    // return Array.from(new Set([...list1, ...list2]));
    return [...list1, ...list2].filter((ele, index, array) => array.indexOf(ele) === index);
  }

  delete(element: T): void {
    this.data = this.data.filter(el => el !== element);
  }

  disconnect(): void {
    this.subscriptions.unsubscribe();
  }
}
