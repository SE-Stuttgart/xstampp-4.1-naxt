import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Controller } from '@src-shared/control-structure/models';
import { SubCategory } from '@stpa/index';

@Component({
  selector: 'naxt-stpa-inadequate-ca',
  templateUrl: './stpa-inadequate-ca.component.html',
  styleUrls: ['./stpa-inadequate-ca.component.scss'],
})
export class StpaInadequateCaComponent implements OnInit {
  @Input() chosenSubCategory: string | number = '';
  @Output() chosenSubCategoryChange = new EventEmitter<string>();
  @Input() chosenController: string | number = -1;
  @Output() chosenControllerChange = new EventEmitter<number>();
  @Input() chosenControlAction: string = '';
  @Output() chosenControlActionChange = new EventEmitter<number>();
  @Input() description: string;
  @Output() descriptionChange = new EventEmitter<string>();
  @Input() descriptionIndequate: string;
  @Input() descriptionAttacker: string;
  @Input() descriptionProcedure: string;
  @Output() descriptionIndequateChange = new EventEmitter<string>();
  @Output() descriptionAttackerChange = new EventEmitter<string>();
  @Output() descriptionProcedureChange = new EventEmitter<string>();
  @Input() listOfControllers: Controller[] = [];
  dropDownList: { value: number; label: string }[] = [];
  flawedImplementation: string = SubCategory.ControlAlgorithmFlawedImplementation;
  controlalgoFlawed: string = SubCategory.ControlAlgorithmFlawed;
  inadequateCaOverTime: string = SubCategory.ControlAlgorithmDegradesOverTime;
  byAttacker: string = SubCategory.ControlAlgorithmAttacked;

  listofSubCategories = [
    { value: this.flawedImplementation, label: this.flawedImplementation },
    { value: this.controlalgoFlawed, label: this.controlalgoFlawed },
    {
      value: this.inadequateCaOverTime,
      label: this.inadequateCaOverTime,
    },
    { value: this.byAttacker, label: this.byAttacker },
  ];
  ngOnInit(): void {
    this.listOfControllers.forEach(element => {
      this.dropDownList.push({ value: element.id, label: element.name });
    });
  }

  componentShouldShow(name: string): boolean {
    return this.chosenSubCategory === name;
  }

  OnChangeChosenSubCategory(event: string | number): void {
    this.chosenSubCategoryChange.emit(event as string);
  }

  OnChangeChosenController(event: string | number): void {
    this.chosenControllerChange.emit(event as number);
  }

  OnChangeChosenControlAction(event: string | number): void {
    this.chosenControlActionChange.emit(event as number);
  }

  OnChangeDescriptionChange(event: string): void {
    this.descriptionChange.emit(event);
  }
  OnChangeDescriptionIndequateChange(event: string): void {
    this.descriptionIndequateChange.emit(event);
  }
  OnChangeDescriptionAttackerChange(event: string): void {
    this.descriptionAttackerChange.emit(event);
  }
  OnChangeDescriptionProcedureChange(event: string): void {
    this.descriptionProcedureChange.emit(event);
  }
}
