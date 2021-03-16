/* eslint-disable @typescript-eslint/no-empty-function */
import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterContentChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AppNavigationService } from '@core/services/app-navigation/app-navigation.service';
import { MessageService } from '@core/services/message/message.service';
import { ArrowAndBoxType, ContextMenuData, ContextMenuMode, CSCoordinateData, CSDiaType, CSShape } from '../cs.types';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import {
  Actuator,
  ControlAction,
  ControlledProcess,
  Controller,
  Feedback,
  Input as InputType,
  Output as OutputType,
  Sensor,
} from '@src-shared/control-structure/models';
import { controlStructureController as StpaController } from '@stpa/index';
import { controlStructureController as CastController } from '@cast/index';
import { ControlStructureController } from '@src-shared/control-structure/controller/ControlStructureController';
import * as joint from 'jointjs';
import { CsUtils } from '@shared/components/control-structure/csutils/cs.utils';

@Component({
  selector: 'naxt-cscontext-menu',
  templateUrl: './cscontext-menu.component.html',
  styleUrls: ['./cscontext-menu.component.scss'],
})
export class CSContextMenuComponent implements OnInit, AfterContentChecked {
  @Input() data: ContextMenuData;
  @Input() coordinateData: CSCoordinateData;
  @Input() diaType: CSDiaType;
  @Input() isCast: boolean = false;
  @Input() wasEdited: boolean = false;
  @Input() graph: joint.dia.Graph;
  @Output() closeMenu: EventEmitter<ContextMenuData> = new EventEmitter();
  @Output() deleteEntity: EventEmitter<ContextMenuData> = new EventEmitter();
  @Output() createEntity: EventEmitter<ContextMenuData> = new EventEmitter();
  @Output() resizeBox: EventEmitter<ContextMenuData> = new EventEmitter();

  text: string;
  utils: CsUtils;
  displayedColumns: string[];
  selection: SelectionModel<any> = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any>;
  mode: ContextMenuMode = ContextMenuMode.Menu;
  ContextMenuMode: typeof ContextMenuMode = ContextMenuMode;
  boxType: typeof ArrowAndBoxType = ArrowAndBoxType;
  boxShape: typeof CSShape = CSShape;
  projectId: string;
  entitiesFromRequest: Array<any> = [];
  alreadyLinkedEntities: Array<any> = [];
  isInputOutput: boolean;
  path: string;
  hasEntity: boolean = true;
  controlStructureController: ControlStructureController;

  @ViewChild('nameInput', { static: true }) inputRef: ElementRef<HTMLInputElement>;

  constructor(private readonly msg: MessageService, private readonly navigationService: AppNavigationService) {
    this.displayedColumns = ['select', 'name'];
    this.utils = new CsUtils();
  }

  ngOnInit(): void {
    if (this.isCast) this.controlStructureController = CastController;
    else this.controlStructureController = StpaController;
    this.text = this.data.type;
    this.isInputOutput = this.text.includes('Input') || this.text.includes('Output');

    this.projectId = this.navigationService.currentPoint.projectId;
    this.loadData();
  }

  ngAfterContentChecked(): void {
    if (this.mode === ContextMenuMode.New && this.inputRef !== undefined) {
      this.inputRef.nativeElement.focus();
    }
  }

  get isStep2(): boolean {
    return this.diaType === CSDiaType.STEP2;
  }

  /**
   *   loads the available elements and the already linked elements to highlight
   */
  loadData(): void {
    const pId: string = this.navigationService.currentPoint.projectId;
    let obs: Observable<any[]>;

    switch (this.data.type) {
      case ArrowAndBoxType.Actuator:
        obs = this.controlStructureController.getAllActuators$(pId).pipe(
          take(1),
          tap((s: Actuator[]) => {
            this.entitiesFromRequest = s;
            this.dataSource = new MatTableDataSource<any>(s);
            this.alreadyLinkedEntities = s.filter(ele => ele.boxId === this.data?.id);
            this.alreadyLinkedEntities.forEach(ele => this.selection.toggle(ele));
          })
        );
        break;
      case ArrowAndBoxType.ControlledProcess:
        obs = this.controlStructureController.getAllControlledProcesses$(pId).pipe(
          take(1),
          tap((s: ControlledProcess[]) => {
            this.entitiesFromRequest = s;
            this.dataSource = new MatTableDataSource<any>(s);
            this.alreadyLinkedEntities = s.filter(ele => ele.boxId === this.data?.id);
            this.alreadyLinkedEntities.forEach(ele => this.selection.toggle(ele));
          })
        );
        break;
      case ArrowAndBoxType.Controller:
        obs = this.controlStructureController.getAllControllers$(pId).pipe(
          take(1),
          tap((s: Controller[]) => {
            this.entitiesFromRequest = s;
            this.dataSource = new MatTableDataSource<any>(s);
            this.alreadyLinkedEntities = s.filter(ele => ele.boxId === this.data?.id);
            this.alreadyLinkedEntities.forEach(ele => this.selection.toggle(ele));
          })
        );
        break;
      case ArrowAndBoxType.Sensor:
        obs = this.controlStructureController.getAllControlledSensors$(pId).pipe(
          take(1),
          tap((s: Sensor[]) => {
            this.entitiesFromRequest = s;
            this.dataSource = new MatTableDataSource<any>(s);
            this.alreadyLinkedEntities = s.filter(ele => ele.boxId === this.data?.id);
            this.alreadyLinkedEntities.forEach(ele => this.selection.toggle(ele));
          })
        );
        break;
      case ArrowAndBoxType.ControlAction:
        obs = this.controlStructureController.getAllControlActions$(pId).pipe(
          take(1),
          tap((s: ControlAction[]) => {
            this.entitiesFromRequest = s;
            this.dataSource = new MatTableDataSource<any>(s);
            this.alreadyLinkedEntities = s.filter(ele => ele.arrowId.includes(this.data?.id));
            this.alreadyLinkedEntities.forEach(ele => this.selection.toggle(ele));
          })
        );
        break;
      case ArrowAndBoxType.Feedback:
        obs = this.controlStructureController.getAllFeedback$(pId).pipe(
          take(1),
          tap((s: Feedback[]) => {
            this.entitiesFromRequest = s;
            this.dataSource = new MatTableDataSource<any>(s);
            this.alreadyLinkedEntities = s.filter(ele => ele.arrowId.includes(this.data?.id));
            this.alreadyLinkedEntities.forEach(ele => this.selection.toggle(ele));
          })
        );
        break;
      case ArrowAndBoxType.Output:
        obs = this.controlStructureController.getAllOutputs$(pId).pipe(
          take(1),
          tap((s: OutputType[]) => {
            this.entitiesFromRequest = s;
            this.dataSource = new MatTableDataSource<any>(s);
            this.alreadyLinkedEntities = s.filter(ele => ele.arrowId.includes(this.data?.id));
            this.alreadyLinkedEntities.forEach(ele => this.selection.toggle(ele));
          })
        );
        break;
      case ArrowAndBoxType.Input:
        obs = this.controlStructureController.getAllInputs$(pId).pipe(
          take(1),
          tap((s: InputType[]) => {
            this.entitiesFromRequest = s;
            this.dataSource = new MatTableDataSource<any>(s);
            this.alreadyLinkedEntities = s.filter(ele => ele.arrowId.includes(this.data?.id));
            this.alreadyLinkedEntities.forEach(ele => this.selection.toggle(ele));
          })
        );
        break;
    }

    obs?.subscribe();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  /** Selects a single row; boxes can only have one selected element. */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  select(event: MouseEvent, row: any): void {
    if (this.data.shape === CSShape.BOX) {
      const isSelected: boolean = this.selection.isSelected(row);
      this.selection.clear();
      if (isSelected) {
        this.selection.toggle(row);
      }
    }
    event.stopPropagation();
  }

  clearArrays(): void {
    this.entitiesFromRequest = [];
    this.alreadyLinkedEntities = [];
  }

  close(): void {
    this.closeMenu.emit();
    this.mode = ContextMenuMode.Menu;
    this.clearArrays();
  }

  async onSave(): Promise<void> {
    const pId: string = this.navigationService.currentPoint.projectId;

    if (this.selection.selected.length > 0) {
      switch (this.data.type) {
        case ArrowAndBoxType.Actuator:
          await this.controlStructureController.updateBoxLinkActuator(pId, this.selection.selected[0].id, this.data.id);
          break;
        case ArrowAndBoxType.ControlledProcess:
          await this.controlStructureController.updateBoxLinkControlledProcess(
            pId,
            this.selection.selected[0].id,
            this.data.id
          );
          break;
        case ArrowAndBoxType.Controller:
          await this.controlStructureController.updateBoxLinkController(
            pId,
            this.selection.selected[0].id,
            this.data.id
          );
          break;
        case ArrowAndBoxType.Sensor:
          await this.controlStructureController.updateBoxLinkSensor(pId, this.selection.selected[0].id, this.data.id);
          break;
        case ArrowAndBoxType.ControlAction:
          await this.controlStructureController.updateArrowLinksControlAction(
            pId,
            this.selection.selected.map(ele => ele.id),
            this.data.id
          );
          break;
        case ArrowAndBoxType.Feedback:
          await this.controlStructureController.updateArrowLinksFeedback(
            pId,
            this.selection.selected.map(ele => ele.id),
            this.data.id
          );
          break;
        case ArrowAndBoxType.Output:
          await this.controlStructureController.updateArrowLinksOutput(
            pId,
            this.selection.selected.map(ele => ele.id),
            this.data.id
          );
          break;
        case ArrowAndBoxType.Input:
          await this.controlStructureController.updateArrowLinksInput(
            pId,
            this.selection.selected.map(ele => ele.id),
            this.data.id
          );
          break;
      }

      const cell = this.graph.getCell(this.data.id);

      if (this.data.shape === CSShape.BOX) {
        cell.attr({
          label: {
            text: this.selection.selected[0].name,
          },
        });
      } else if (this.data.shape === CSShape.ARROW) {
        const dist: number = 100 / this.selection.selected.length;
        const offset: number = dist / 2;
        (cell as joint.dia.Link).labels([]);

        this.selection.selected.forEach((ele: any, i: number) => {
          (cell as joint.dia.Link).label(i, {
            attrs: {
              text: {
                text: ele.name.split('@?!@')[0] ? this.utils.breakText(ele.name.split('@?!@')[0], 15) : '',
              },
            },
            position: {
              distance:
                ele.name.split('@?!@')[1] && ele.name.split('@?!@')[1].split('o')[0]
                  ? +ele.name.split('@?!@')[1].split('o')[0]
                  : (i * dist + offset) / 110,
              offset:
                ele.name.split('@?!@')[1] &&
                ele.name.split('@?!@')[1].split('o')[1] &&
                +ele.name.split('@?!@')[1].split('o')[1],
            },
          });
        });
      }
      this.clearArrays();
      this.close();
    }
  }

  link(): void {
    this.mode = ContextMenuMode.Link;
  }

  delete(): void {
    this.mode = ContextMenuMode.Menu;
    const deleteEntityIds: string[] = [];
    if (this.alreadyLinkedEntities) {
      this.alreadyLinkedEntities.forEach((entity: any) => {
        deleteEntityIds.push(entity.id);
      });
    }
    this.deleteEntity.emit({
      id: this.data.id,
      deleteEntityIds: deleteEntityIds,
      shape: this.data.shape,
      type: this.data.type,
    } as ContextMenuData);
    this.clearArrays();
  }

  resize(): void {
    this.resizeBox.emit({ id: this.data.id, type: this.data.type } as ContextMenuData);
  }

  startCreation(): void {
    this.mode = ContextMenuMode.New;
  }

  create(name: string): void {
    let saveEntity: boolean = true;
    if (this.data.type.includes('Box')) {
      saveEntity = false;
    }
    this.createEntity.emit({
      name: name,
      type: ArrowAndBoxType[this.data.type],
      id: this.data.id,
      shape: this.data.shape,
      saveEntity: saveEntity,
    } as ContextMenuData);
    this.mode = ContextMenuMode.Menu;
    this.clearArrays();
  }
}
