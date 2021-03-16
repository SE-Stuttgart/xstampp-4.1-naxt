import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Chip as STPAChip } from '@stpa/src/main/services/models/table-models/Chip';
import { Chip as CastChip } from '@cast/index';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Subscriptions } from '../../utils/subscriptions';

export interface ChipArray {
  key: string;
}

export type Chip = STPAChip | CastChip;

@Component({
  selector: 'naxt-chip-controller',
  templateUrl: './chip-controller.component.html',
  styleUrls: ['./chip-controller.component.scss'],
})
export class ChipControllerComponent {
  subscriptions: Subscriptions = new Subscriptions();

  selectable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  formControl = new FormControl(); // control for autoFill
  filteredChips: Observable<Chip[]>; // list of searchable chips

  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Input() label: string;

  private _chipList: Chip[];
  @Input() set chipList(chipList: Chip[]) {
    this._chipList = [...chipList];

    this.selectList.next(chipList.filter(chip => chip.selected));
    this.filterList.next(chipList.filter(chip => !chip.selected));
  }

  get chipList(): Chip[] {
    return this._chipList;
  }

  @Input() singleChip: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Output() chipListChange: EventEmitter<Chip[]> = new EventEmitter<Chip[]>();
  @Output() addChip: EventEmitter<Chip> = new EventEmitter<Chip>();
  @Output() removeChip: EventEmitter<Chip> = new EventEmitter<Chip>();

  filterList: BehaviorSubject<Chip[]> = new BehaviorSubject<Chip[]>([]);
  selectList: BehaviorSubject<Chip[]> = new BehaviorSubject<Chip[]>([]);

  cntxt;

  constructor() {
    this.subscriptions.plusOne = this.formControl.valueChanges
      .pipe(tap((value: string | null) => value && this._filter(value)))
      .subscribe();

    this.cntxt = this;
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

  remove(chip: Chip): void {
    if (!this.readonly) {
      let foundChip: Chip;
      if (!!(foundChip = this.chipList.find(c => c.id === chip.id))) {
        foundChip.selected = false;
        this.selectList.next(this.chipList.filter(chip => chip.selected));
        this.filterList.next(this.chipList.filter(chip => !chip.selected));
        this.chipListChange.emit(this.chipList);
        this.removeChip.emit(foundChip);
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const chip = this.chipList.find(chip => chip.id.toString() === event.option.value.toString());

    if (this.singleChip) {
      this.chipList.forEach(chip => {
        chip.selected = false;
      });
    }

    let foundChip: Chip;
    if (!!(foundChip = this.chipList.find(c => c.id === chip.id))) {
      foundChip.selected = true;
      this.selectList.next(this.chipList.filter(chip => chip.selected));
      this.filterList.next(this.chipList.filter(chip => !chip.selected));
      this.chipListChange.emit(this.chipList);
      this.addChip.emit(foundChip);
      this.chipInput.nativeElement.value = '';
      this.formControl.setValue(null);
    }
  }

  getLabel(chip: Chip): string {
    return `${chip?.label}`.trim();
  }

  getAutoCompleteLabel(chip: Chip): string {
    return `${chip?.label} ${chip?.name}`.trim();
  }

  getTooltip(chip: Chip): string {
    return `${chip?.name}`.trim();
  }

  private _filter(value: string): void {
    this.filterList.next(
      this.chipList.filter(chip => !chip.selected).filter(chip => chip.id.toString() === value.toString())
    );
  }
}
