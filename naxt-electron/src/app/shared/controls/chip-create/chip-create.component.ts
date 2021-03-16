import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subscriptions } from '@shared/utils';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'naxt-chip-create',
  templateUrl: './chip-create.component.html',
  styleUrls: ['./chip-create.component.scss'],
})
export class ChipCreateComponent {
  subscriptions: Subscriptions = new Subscriptions();

  selectable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Input() label: string;

  private _chipList: string[];
  @Input() set chipList(chipList: string[]) {
    this._chipList = [...chipList];
  }

  get chipList(): string[] {
    return this._chipList;
  }

  @Input() singleChip: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Output() chipListChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.chipList.push(value.trim());
    }

    if (input) input.value = '';

    this.chipListChange.emit(this.chipList);
  }

  remove(chip: string): void {
    const index = this.chipList.indexOf(chip);

    if (index >= 0) {
      this.chipList.splice(index, 1);
    }

    this.chipListChange.emit(this.chipList);
  }
}
