import { Component } from '@angular/core';
import { Chip } from '@shared/index';
@Component({
  selector: 'naxt-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  isTrue: boolean = false;
  isString: string;
  placeholder: string = 'test';
  arrayElements = [
    { value: 'discreet', label: 'discreet' },
    { value: 'not-discreet', label: 'not-discreet' },
  ];
  testVal: string | number = 'discreet';
  titleDD: string = 'select Variable Type';
  chipArray = [];
  titleCC: string = 'select Chip';
  chipLabel: string = 'Chip Test Label';
  arrayChipList: Chip[] = [
    { name: 'Chip1', id: 1, selected: false, label: 'C1-' },
    { name: 'Chip2', id: 2, selected: true, label: 'C2-' },
    { name: 'Chip3', id: 3, selected: false, label: 'C3-' },
  ];
  textareaTitle: string = 'Description';
  descriptionText: string;
  maxRows: number = 5;
  listOfThings: Array<string> = ['test1', 'test2'];
  selectedValue: string = 'test1';
}
