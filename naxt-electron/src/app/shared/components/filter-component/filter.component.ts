import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EntityState, NestedEmit } from '../table/table.types';
import { FilterChip, FilterEntry } from './filter.types';
import { NestedModels, RequiredModels } from '@stpa/index';

@Component({
  selector: 'naxt-filter-component',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, AfterContentInit {
  EntityState = EntityState;

  visible = true;
  selectable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  formControl = new FormControl(); // control for autoFill
  filteredChips: Observable<FilterChip[]>; // list of searchable chips
  selectedChips: FilterChip[] = []; // selected chips with values for filter
  allChips: FilterChip[] = []; // all possible chips

  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  private _filterList: FilterChip[];

  // updates the filter
  private shouldUpdateStrings: boolean = true;
  @Input() set filterList(v: FilterChip[]) {
    this._filterList = v;

    /**
     * updates the filter labels until it detects a change (resolves the translate observanle)
     * after that the update is no longer needed
     */
    if (!!this.allChips && !!this.selectedChips && this.shouldUpdateStrings) {
      v.forEach(chip => {
        if (this.allChips.find(c => c.key === chip.key)) {
          const tempChip = this.allChips.find(c => c.key === chip.key);

          if (this.shouldUpdateStrings && tempChip.label !== chip.label) {
            this.shouldUpdateStrings = false;
          }
          tempChip.label = chip.label;
        }
        if (this.selectedChips.find(c => c.key === chip.key)) {
          this.selectedChips.find(c => c.key === chip.key).label = chip.label;
        }
      });
    }
  }
  get filterList(): FilterChip[] {
    return this._filterList;
  }
  nestedModels: NestedModels = { id: -1, name: '', modelLabel: '', nestedModels: [], parentId: -1 };
  @Input() width: string;
  @Input() showStateFilter: boolean = false;
  @Input() filterShowMenu: boolean = false;
  @Input() hideAdd: boolean = false;
  @Input() parent: string[] = [];
  @Input() menuList: FilterEntry[];
  @Input() menuMapList: RequiredModels;
  @Output() searchList: EventEmitter<FilterChip[]> = new EventEmitter<FilterChip[]>();
  @Output() addEmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() menuEmit: EventEmitter<FilterEntry> = new EventEmitter<FilterEntry>();
  @Output() menuMapEmit: EventEmitter<NestedEmit> = new EventEmitter<NestedEmit>();

  cntxt;
  constructor(private readonly cdr: ChangeDetectorRef) {
    this.filteredChips = this.formControl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => (value ? this._filter(value) : this.allChips.slice()))
    );

    this.cntxt = this;
  }

  ngOnInit(): void {
    this.filterList?.forEach((chip: FilterChip) => {
      if (!chip.fixed) this.allChips.push({ ...chip });
      if (chip.preSet || chip.fixed) this.selectedChips.push({ ...chip, andOperator: !chip.orOperator });
    });
  }

  ngAfterContentInit(): void {
    this.emitSearchList();
  }

  add(_event: MatChipInputEvent): void {
    // // Add chip only when MatAutocomplete is not open
    // // To make sure this does not conflict with OptionSelected Event
    // if (!this.matAutocomplete.isOpen) {
    //   const input = event.input;
    //   const value = event.value;
    //   // Add our chip
    //   if ((value || '').trim()) {
    //     this.selectedChips.push(this.allChips.find(s => s.label === value.trim()));
    //   }
    //   // Reset the input value
    //   if (input) {
    //     input.value = '';
    //   }
    //   this.formControl.setValue(null);
    // }
  }

  remove(chip: FilterChip): void {
    const index = this.selectedChips.indexOf(chip);

    if (index >= 0) {
      this.selectedChips.splice(index, 1);
    }
    this.emitSearchList();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let state: EntityState;
    if (!!(state = EntityState[event.option.viewValue])) {
      this.selectedChips.push({
        label: state,
        key: 'state',
        value: state,
        stateChip: true,
        andOperator: true,
        orOperator: false,
      });
    } else {
      this.selectedChips.push({
        ...this.allChips.find(s => s.label === event.option.viewValue),
        andOperator: true,
        value: '',
      });
    }
    this.chipInput.nativeElement.value = '';
    this.formControl.setValue(null);
    this.emitSearchList();
  }

  emitSearchList(): void {
    this.searchList.emit(this.selectedChips);
  }

  getLabel(chip: FilterChip): string {
    return chip.stateChip ? '' : ':';
  }

  operatorClick(event: MouseEvent, chip: FilterChip, field: 'not' | 'and' | 'or'): void {
    event.stopPropagation();
    event.preventDefault();
    switch (field) {
      case 'and': {
        chip.andOperator = true;
        chip.orOperator = false;
        break;
      }
      case 'or': {
        chip.andOperator = false;
        chip.orOperator = true;
        break;
      }
      case 'not': {
        chip.notOperator = !chip.notOperator;
        break;
      }
    }
    this.emitSearchList();
  }

  private _filter(value: string): FilterChip[] {
    const filterValue = value.toLowerCase();

    return this.allChips.filter(chip => chip.label.toLowerCase().includes(filterValue));
  }

  menuClick(str: FilterEntry): void {
    this.menuEmit.emit(str);
  }
  menuMapClick(str1: NestedModels, str2: NestedModels): void {
    this.menuMapEmit.emit({ main: str1, sub: str2 });
  }
}
