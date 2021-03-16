import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Controller } from '@src-shared/control-structure/models';
import { SubCategory } from '@stpa/index';

@Component({
  selector: 'naxt-stpa-unsafe-ci',
  templateUrl: './stpa-unsafe-ci.component.html',
  styleUrls: ['./stpa-unsafe-ci.component.scss'],
})
export class StpaUnsafeCiComponent implements OnInit {
  @Input() subCategory: string = SubCategory.UnsafeControlActionReceived;
  @Input() chosenSourceController: string | number;
  @Input() chosenTargetController: string | number;
  @Input() chosenControlAction: string;
  @Output() chosenSourceControllerChange = new EventEmitter<number>();
  @Output() chosenTargetControllerChange = new EventEmitter<number>();
  @Output() chosenControlActionChange = new EventEmitter<number>();
  @Input() listOfControllers: Controller[] = [];
  @Input() listOfControllers2: Controller[] = [];
  dropDownList: { value: number; label: string }[] = [];
  dropDownList2: { value: number; label: string }[] = [];

  ngOnInit(): void {
    this.listOfControllers.forEach(element => {
      this.dropDownList.push({ value: element.id, label: element.name });
    });
    this.listOfControllers2.forEach(element => {
      this.dropDownList2.push({ value: element.id, label: element.name });
    });
  }

  onChangeSourceControllerChange(event: string | number): void {
    this.chosenSourceControllerChange.emit(event as number);
  }

  onChangeTargetControllerChange(event: string | number): void {
    this.chosenTargetControllerChange.emit(event as number);
  }

  onChangeControlActionChange(event: string | number): void {
    this.chosenControlActionChange.emit(event as number);
  }
}
