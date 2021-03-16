import { Component } from '@angular/core';
import { CSDiaType } from '@shared/components/control-structure/cs.types';

@Component({
  selector: 'naxt-stpa-control-structure',
  templateUrl: './stpa-control-structure.component.html',
  styleUrls: ['./stpa-control-structure.component.scss'],
})
export class StpaControlStructureComponent {
  readonly CSDiaType = CSDiaType;

  canDeactivate: boolean = true;
}
