import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Controller } from '@src-shared/control-structure/models';

@Component({
  selector: 'naxt-dropdown-control',
  templateUrl: './dropdown-control.component.html',
  styleUrls: ['./dropdown-control.component.scss'],
})
export class DropdownControlComponent {
  @Input() dropdownList: { value: string | number; label: string }[] = [];
  @Input() stringList: string[];
  @Input() label: string;
  @Input() value: string | number;
  @Output() valueChange = new EventEmitter<string | number>();

  onChange($newValue: string | number): void {
    this.valueChange.emit($newValue);
  }
}
