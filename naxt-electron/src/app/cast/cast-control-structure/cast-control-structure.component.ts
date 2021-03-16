import { Component } from '@angular/core';
import { CSDiaType } from '@shared/components/control-structure/cs.types';

@Component({
  selector: 'naxt-cast-control-structure',
  templateUrl: './cast-control-structure.component.html',
  styleUrls: ['./cast-control-structure.component.scss'],
})
export class CastControlStructureComponent {
  readonly CSDiaType = CSDiaType;

  canDeactivate: boolean = true;
}
