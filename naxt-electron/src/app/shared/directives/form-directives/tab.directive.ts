import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import { FilterComponent } from '../../components/filter-component/filter.component';

@Directive({
  selector: '[naxtTabDirective]',
})
export class TabDirective {
  constructor(@Optional() private autoTrigger: MatAutocompleteTrigger, private elRef: ElementRef<MatInput>) {}

  @Input() naxtTabDirective: FilterComponent;
  @Input() formControl: FormControl;
  @HostListener('keydown.tab', ['$event.target']) onBlur(): void {
    if (this.autoTrigger.activeOption) {
      // for FilterComponent
      if (!!this.naxtTabDirective && typeof this.naxtTabDirective === 'object') {
        this.naxtTabDirective.selected({
          option: {
            viewValue: this.autoTrigger.activeOption.viewValue,
          },
        } as MatAutocompleteSelectedEvent);
      } else {
        this.formControl.setValue(this.autoTrigger.activeOption.value);
      }
    }
  }
}
