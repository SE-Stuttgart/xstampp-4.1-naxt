import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Controller } from '@src-shared/control-structure/models';

@Component({
  selector: 'naxt-stpa-failures',
  templateUrl: './stpa-failures.component.html',
  styleUrls: ['./stpa-failures.component.scss'],
})
export class StpaFailuresComponent implements OnInit {
  @Input() description: string;
  @Output() descriptionChange = new EventEmitter<string>();
  @Input() chosenController: string | number = -1;
  @Output() chosenControllerChange = new EventEmitter<number>();
  @Input() listOfControllers: Controller[] = [];
  dropDownList: { value: number; label: string }[] = [];

  onChangeDescription(event: string): void {
    this.descriptionChange.emit(event);
  }
  onChosenControllerChange(event: number | string): void {
    this.chosenControllerChange.emit(event as number);
  }

  ngOnInit(): void {
    this.listOfControllers.forEach(element => {
      this.dropDownList.push({ value: element.id, label: element.name });
    });
  }
}
