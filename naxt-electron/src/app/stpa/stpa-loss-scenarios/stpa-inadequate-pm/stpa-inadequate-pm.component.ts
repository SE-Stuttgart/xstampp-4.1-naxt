import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Reason, SubCategory } from '@stpa/index';
import { Controller, Input as InputModel, Feedback, Sensor, Box } from '@src-shared/control-structure/models';

@Component({
  selector: 'naxt-stpa-inadequate-pm',
  templateUrl: './stpa-inadequate-pm.component.html',
  styleUrls: ['./stpa-inadequate-pm.component.scss'],
})
export class StpaInadequatePmComponent implements OnInit {
  @Input() listOfControllers: Controller[] = [];
  @Input() chosenController: string | number = -1;
  @Output() chosenControllerChange = new EventEmitter<number>();
  dropDownListController: { value: number; label: string }[] = [];

  @Input() listOfInputs: InputModel[] = [];
  @Input() chosenInput: string | number = -1;
  @Output() chosenInputChange = new EventEmitter<number>();
  dropDownListInput: { value: number; label: string }[] = [];

  @Input() listOfFeedbacks: Feedback[] = [];
  @Input() chosenFeedback: string | number = -1;
  @Output() chosenFeedbackChange = new EventEmitter<number>();
  dropDownListFeedback: { value: number; label: string }[] = [];

  @Input() listOfSensors: Sensor[] = [];
  @Input() chosenSensor: string | number = -1;
  @Output() chosenSensorChange = new EventEmitter<number>();
  dropDownListSensor: { value: number; label: string }[] = [];

  @Input() chosenSubCategory: string | number = '';
  @Output() chosenSubCategoryChange = new EventEmitter<string>();

  @Input() listOfBoxes: Box[] = [];
  @Input() chosenInputBox: string | number = '';
  @Output() chosenInputBoxChange = new EventEmitter<string>();
  dropDownListBoxes: { value: string; label: string }[] = [];

  @Input() descriptionWrong: string;
  @Input() descriptionReason: string;
  @Output() descriptionWrongChange = new EventEmitter<string>();
  @Output() descriptionReasonChange = new EventEmitter<string>();
  @Input() chosenPossibleSensorReason: string | number = '';
  @Input() chosenPossibleFeedbackReason: string | number = '';
  @Output() chosenPossibleSensorReasonChange = new EventEmitter<string>();
  @Output() chosenPossibleFeedbackReasonChange = new EventEmitter<string>();

  incorrect: SubCategory = SubCategory.ControllerReceivedIncorrectFeedback;
  notReceived: SubCategory = SubCategory.ControllerNotReceivedFeedback;
  correctButInterpretedWrong: SubCategory = SubCategory.ControllerInterpretsCorrectFeedbackWrong;
  feedbackSend: Reason = Reason.FeedbackSendButNotReceivedByController;
  feedbackNotSend: Reason = Reason.FeedbackNotSendButReceivedOrAppliedBySensor;
  feedbackNotReceived: Reason = Reason.FeedbackNotReceivedOrAppliedBySensor;
  feedbackNotExists: Reason = Reason.FeedbackNotExistsInControlStructureOrSensor;

  sensorRespondsAdequately: Reason = Reason.SensorRespondsAdequately;
  sensorNotDesigned: Reason = Reason.SensorNotDesignedForNecessaryFeedback;
  sensorRespondsInadequately: Reason = Reason.SensorRespondsInadequately;

  listofSubCategories = [
    { value: this.incorrect, label: this.incorrect },
    {
      value: this.correctButInterpretedWrong,
      label: this.correctButInterpretedWrong,
    },
    {
      value: this.notReceived,
      label: this.notReceived,
    },
  ];

  listofPossibleSensorReason = [
    { value: this.sensorRespondsAdequately, label: this.sensorRespondsAdequately },
    {
      value: this.sensorNotDesigned,
      label: this.sensorNotDesigned,
    },
    {
      value: this.sensorRespondsInadequately,
      label: this.sensorRespondsInadequately,
    },
  ];
  listofPossibleFeedbackReason = [
    { value: this.feedbackSend, label: this.feedbackSend },
    {
      value: this.feedbackNotSend,
      label: this.feedbackNotSend,
    },
    {
      value: this.feedbackNotReceived,
      label: this.feedbackNotReceived,
    },
    {
      value: this.feedbackNotExists,
      label: this.feedbackNotExists,
    },
  ];
  componentShouldShow(name: string): boolean {
    return this.chosenSubCategory === name;
  }
  ngOnInit(): void {
    this.listOfControllers.forEach(element => {
      this.dropDownListController.push({ value: element.id, label: element.name });
    });
    this.listOfInputs.forEach(element => {
      this.dropDownListInput.push({ value: element.id, label: element.name });
    });
    this.listOfFeedbacks.forEach(element => {
      this.dropDownListFeedback.push({ value: element.id, label: element.name });
    });
    this.listOfSensors.forEach(element => {
      this.dropDownListSensor.push({ value: element.id, label: element.name });
    });
    this.listOfBoxes.forEach(element => {
      this.dropDownListBoxes.push({ value: element.id, label: element.name });
    });
  }
  onChangeChosenControllerChange(event: string | number): void {
    this.chosenControllerChange.emit(event as number);
  }
  onChangeChosenInputChange(event: string | number): void {
    this.chosenInputChange.emit(event as number);
  }
  onChangeChosenFeedbackChange(event: string | number): void {
    this.chosenFeedbackChange.emit(event as number);
  }
  onChangeChosenSensorChange(event: string | number): void {
    this.chosenSensorChange.emit(event as number);
  }

  onChangeChosenSubCategoryChange(event: string | number): void {
    this.chosenSubCategoryChange.emit(event as string);
  }
  onChangeChosenInputBoxChange(event: string | number): void {
    this.chosenInputBoxChange.emit(event as string);
  }
  onChangeDescriptionWrongChange(event: string | number): void {
    this.descriptionWrongChange.emit(event as string);
  }
  onChangeDescriptionReasonChange(event: string | number): void {
    this.descriptionReasonChange.emit(event as string);
  }
  onChangeChosenPossibleSensorReasonChange(event: string | number): void {
    this.chosenPossibleSensorReasonChange.emit(event as string);
  }
  onChangeChosenPossibleFeedbackReasonChange(event: string | number): void {
    this.chosenPossibleFeedbackReasonChange.emit(event as string);
  }
}
