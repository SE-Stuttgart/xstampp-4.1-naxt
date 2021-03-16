import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { AppNavigationService } from '@core/services/app-navigation/app-navigation.service';
import { MessageService } from '@core/services/message/message.service';
import * as joint from 'jointjs';
import { CSAdapter } from './cs.adapter';
import { ArrowAndBoxType, ContextMenuData, CSDiaType, CSShape, CsToolbarMode } from './cs.types';

@Component({
  selector: 'naxt-control-structure',
  templateUrl: './control-structure.component.html',
  styleUrls: ['./control-structure.component.scss'],
})
export class ControlStructureComponent extends CSAdapter implements OnDestroy {
  @Input() diaType: CSDiaType = CSDiaType.STEP4; // sets the type of the dia, STEP2 or STEP4,
  @Output() changeDiaType: EventEmitter<string> = new EventEmitter<string>();

  @Input() canDeactivate: boolean;
  @Output() canDeactivateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // private controlStructure: ControlStructure;

  constructor(readonly navigationService: AppNavigationService, readonly messageService: MessageService) {
    super(navigationService, messageService);
  }

  CsToolbarMode: typeof CsToolbarMode = CsToolbarMode;
  mode: CsToolbarMode = CsToolbarMode.READONLY;
  private defaultHeight: number = 100;
  private defaultWidth: number = 200;

  hasChanges: boolean = false;

  async ngOnDestroy(): Promise<void> {
    await this.saveControlStructure();
    this.subscriptions.unsubscribe();
  }

  async saveControlStructure(): Promise<void> {
    this.hasChanges = false;
    this.mode = CsToolbarMode.READONLY;
    this.isEditable = false;
    this.csContextmenu = false;
    this.paper.setInteractivity(false);
    // await this.doPendingRequests();
    await this.parseJointToJSON();
    this.canDeactivateChange.emit(true);
    // this.mouseDown = false;
  }

  drop(ev: any): void {
    ev.preventDefault();
    this.csContextmenu = false;
    this.unlockInteraction();
    let shape: joint.dia.Element;
    const type: string = ev.dataTransfer.getData('type');
    if (ev.dataTransfer.getData('shape') === CSShape.BOX) {
      shape = this.shapeUtils.getShapeByName(type);
      const pan: SvgPanZoom.Point = this.panAndZoom.getPan();
      const zoom: number = this.panAndZoom.getZoom();
      if (pan.x !== 0 || pan.y !== 0 || zoom !== 1) {
        shape.position((ev.layerX - pan.x) / zoom, (ev.layerY - pan.y) / zoom);
      } else {
        shape.position(ev.layerX, ev.layerY);
      }
      shape.resize(this.defaultWidth, this.defaultHeight);
      shape.attr({
        xstampp: {
          type: type,
        },
      });
      this.graph.addCell(shape);
    } else {
      const pan: SvgPanZoom.Point = this.panAndZoom.getPan();
      const zoom: number = this.panAndZoom.getZoom();
      const point = new joint.g.Point();
      if (this.utils.isFirefox) {
        // why is firefox the only browser that calculates the layerposition relativ (with zoom and pan?!?!)
        point.x = ev.layerX;
        point.y = ev.layerY;
      } else {
        point.x = (ev.layerX - pan.x) / zoom;
        point.y = (ev.layerY - pan.y) / zoom;
      }
      const elemsUnderPointer: joint.dia.Element[] = this.graph.findModelsFromPoint(point);
      if (elemsUnderPointer.length > 0) {
        if (elemsUnderPointer[0].attributes.type.includes('xstampp')) {
          shape = elemsUnderPointer[0];
        } else {
          shape = elemsUnderPointer[1];
        }
        if (
          this.utils.isValidPlacement(
            ArrowAndBoxType[type],
            this.utils.jointTypeToArrowAndBoxType(shape.attributes.type),
            true
          )
        ) {
          this.highlightCell(shape);
          this.highlightMode = true;
          this.arrowType = ev.dataTransfer.getData('type');
          this.arrowId = shape.id;
        } else {
          this.messageService.info('Element falsch Positioniert!');
        }
      } else {
        this.messageService.info('Element falsch Positioniert!');
      }
    }
  }

  allowDrop(ev: DragEvent): void {
    ev.preventDefault();
  }

  /**
   * Edit Controlls-Functions
   */
  cancelEdit(): void {
    this.mode = CsToolbarMode.READONLY;
    this.isEditable = false;
    this.csContextmenu = false;
    this.paper.setInteractivity(false);
    this.canDeactivateChange.emit(true);
  }

  startEdit(): void {
    this.hasChanges = true;
    this.mode = CsToolbarMode.OPEN;
    this.isEditable = true;
    this.unlockInteraction();

    this.canDeactivateChange.emit(false);
  }

  closeOpenBar(): void {
    if (this.mode === CsToolbarMode.OPEN) {
      this.mode = CsToolbarMode.CLOSED;
    } else {
      this.mode = CsToolbarMode.OPEN;
    }
  }

  closeContextmenu(data: ContextMenuData): void {
    // close menu and give access to graph back
    this.csContextmenu = false;
    this.unlockInteraction();

    console.log(data);
  }

  /**
   * Deletes a shape and all the connected entities
   * @param data: dto from the contextmenu
   */
  async deleteShape(data: ContextMenuData): Promise<void> {
    const cell: joint.dia.Cell = this.graph.getCell(data.id);
    data.type = ArrowAndBoxType[data.type];
    if (data.shape === CSShape.BOX) {
      for (let i: number = 0; i < this.graph.getConnectedLinks(cell).length; i++) {}
    }
    cell.remove();
    this.csContextmenu = false;
    this.unlockInteraction();
  }

  /**
   * Creates new entities (called from contextmenu)
   * @param data: dto includes the new entity and other data to do the necessary requests
   */
  async createEntity(data: ContextMenuData): Promise<void> {
    const cell: joint.dia.Cell = this.graph.getCell(data.id);
    this.createEntityHelper(data).then(s => {
      if (data.shape === CSShape.BOX) {
        cell.attr({
          label: {
            text: data.name,
          },
        });
        this.setparentOfCell(data.id, [(s as unknown) as string]); // if cell is a box overwrites the exsiting parent
      } else {
        // sets the labels for the arrows.
        if ((cell as joint.dia.Link).attributes.labels) {
          (cell as joint.dia.Link).label((cell as joint.dia.Link).attributes.labels.length, {
            attrs: {
              text: {
                text: this.utils.breakText(data.name, 15),
              },
            },
          });
        } else {
          (cell as joint.dia.Link).label(0, {
            attrs: {
              text: {
                text: this.utils.breakText(data.name, 15),
              },
            },
          });
        }
        this.setparentOfCell(data.id, [s.toString()], []); // if cell is an arrow adds the parent to the existing one(s);
      }

      this.csContextmenu = false;
      this.unlockInteraction();
    });
  }
}
