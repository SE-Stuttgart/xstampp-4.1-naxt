import { Subscriptions } from '@shared/utils';
import { ProjectType, State } from '@src-shared/Enums';
import {
  Actuator,
  Arrow,
  Box,
  ControlAction,
  ControlledProcess,
  Controller,
  ControlStructure,
  Feedback,
  Input as OwnInput,
  Output,
  Sensor,
} from '@src-shared/control-structure/models';
import { delay, take, tap } from 'rxjs/operators';
import { CSControls } from './cs.controls';
import { ArrowAndBoxType, ContextMenuData, CSShape } from './cs.types';
import { SVGUtils } from './csutils/svg.utils';
import { AfterViewInit, Directive, Input } from '@angular/core';
import { AppNavigationService, MessageService } from '@core/services';
import { ControlStructureController } from '@src-shared/control-structure/controller/ControlStructureController';
import { controlStructureController as CastController } from '@cast/index';
import { controlStructureController as StpaController } from '@stpa/index';

@Directive()
export class CSAdapter extends CSControls implements AfterViewInit {
  @Input() isCast: boolean = false;

  private svgUtils: SVGUtils;
  subscriptions: Subscriptions = new Subscriptions();

  controlStructure: ControlStructure;
  get controlStructureController(): ControlStructureController {
    if (this.isCast) return CastController;
    else return StpaController;
  }

  constructor(readonly navigationService: AppNavigationService, readonly messageService: MessageService) {
    super(navigationService, messageService);
    this.svgUtils = new SVGUtils();
  }

  ngAfterViewInit(): void {
    // this.initControlStructure(void 0); // inits the CS after first render is finished

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        delay(500),
        tap(point => {
          this.isCast = point?.projectType === ProjectType.CAST;
          this.graph.clear();
          this.initControlStructure();
          if (!!point?.projectId) this.parseJSONtoJoint(point?.projectId);
        })
      )
      .subscribe();
  }

  async parseJointToJSON(): Promise<ControlStructure> {
    const controlStructure: ControlStructure = {
      ...this.controlStructure,
      svg: '',
      blackAndWhiteSVG: '',
      arrows: [],
      boxes: [],
    };
    const obj: any = this.graph.toJSON();
    controlStructure.svg = this.svgUtils.parseSvgToString(this.paper.svg);
    controlStructure.blackAndWhiteSVG = this.svgUtils.parseSvgToString(this.paper.svg, true);
    obj.cells.forEach((cell: any) => {
      if (cell.type === 'org.Arrow') {
        let arrow: Arrow = {
          source: cell.source.id,
          destination: cell.target.id,
          projectId: this.navigationService.currentPoint.projectId,
        } as Arrow;
        // arrow.projectId = cell.attrs.xstampp.projectId;
        let labelText: string = '';
        cell.labels &&
          cell.labels.forEach((label: joint.dia.Link.Label) => {
            if (label.attrs.text.text.length > 0) {
              const dist: string = (label.position as joint.dia.Link.LabelPosition)
                ? (label.position as joint.dia.Link.LabelPosition).distance.toString()
                : '';
              const offset: string =
                (label.position as joint.dia.Link.LabelPosition) &&
                (label.position as joint.dia.Link.LabelPosition).offset
                  ? (label.position as joint.dia.Link.LabelPosition).offset.toString()
                  : '';
              labelText = labelText + label.attrs.text.text + '@?!@' + dist + 'o' + offset + '@!?@';
              labelText = this.utils.unBreakText(labelText);
            }
          });

        arrow = {
          ...arrow,
          label: labelText.trim() || '',
          type: cell.attrs.xstampp.type,
          id: cell.id,
          parents: cell?.attrs?.xstampp?.parent ?? '',
        };
        if (!!cell?.vertices) {
          arrow = {
            ...arrow,
            parts: cell.vertices.flatMap(point => [point.x, point.y]),
          };
        }
        controlStructure.arrows.push(arrow);
      } else if (cell.type.includes('xstampp.')) {
        const tempName: string = !!cell?.attrs?.label ? this.utils.unBreakText(cell.attrs.label.text) : '';
        const box: Box = {
          id: cell.id,
          name: tempName,
          boxType: cell.attrs.xstampp.type,
          projectId: this.navigationService.currentPoint.projectId,
          parent: Number.parseInt(cell?.attrs?.xstampp?.parent ?? '-1'),
          height: cell.size.height,
          width: cell.size.width,
          x: cell.position.x,
          y: cell.position.y,
        };
        // box.projectId = cell.attrs.xstampp.projectId;
        controlStructure.boxes.push(box);
      }
    });

    return this.controlStructureController.updateControlStructure(controlStructure);
  }

  /**
   * Sets the parentId of the Cell. Can be an Arrow or a Box. Arrows can have more than one parent!
   *
   * @param shapeId the id of the Cell
   * @param parentIds the id to add (Arrow) or set (Box)
   * @param delParentIds the id's that gets deleted from the arrow
   */
  setparentOfCell(shapeId: string, parentIds: Array<string>, delParentIds?: Array<string>): void {
    /**
     * FIXME: refactor the whole CS in front- and backend and use a linktable, or better stringify the Joint-paper and sent it as
     * JSON to the BE!!!
     */
    if (!!delParentIds) {
      const parent = this.graph.getCell(shapeId).attr().xstampp.parent; // gets the current parentids
      const parents: string[] = parent ? parent.toString().split('@?!@') : []; // if current parentids are null inits clean array
      const newParents = [
        ...parents.filter(
          (label: string) => delParentIds.findIndex((delLabel: string) => delLabel === label) === -1 // filters with the labels, that should be deleted
        ),
        ...parentIds, // adds the new labels for the arrow
      ];
      this.graph.getCell(shapeId).attr().xstampp.parent = newParents.join('@?!@'); // joins the labels with the selector
    } else {
      this.graph.getCell(shapeId).attr().xstampp.parent = parentIds[0]; // if it is for the box or the first time a arrow gets created
    }
  }

  parseShape(box: Box): void {
    let shape: any;
    switch (box.boxType) {
      case 'Controller': {
        shape = new this.shapeUtils.ControllerShape({ id: box.id });
        break;
      }
      case 'ControlledProcess': {
        shape = new this.shapeUtils.ProcessShape({ id: box.id });
        break;
      }
      case 'Sensor': {
        shape = new this.shapeUtils.SensorShape({ id: box.id });
        break;
      }
      case 'Actuator': {
        shape = new this.shapeUtils.ActuatorShape({ id: box.id });
        break;
      }
      case 'DashedBox': {
        shape = new this.shapeUtils.DashedBoxShape({ id: box.id });
        break;
      }
      case 'TextBox': {
        shape = new this.shapeUtils.TextBoxShape({ id: box.id });
        break;
      }
      case 'InputBox': {
        shape = new this.shapeUtils.InputBoxShape({ id: box.id });
        break;
      }
      case 'OutputBox': {
        shape = new this.shapeUtils.OutputBoxShape({ id: box.id });
        break;
      }
    }
    shape.position(box.x, box.y);
    shape.resize(box.width, box.height);
    const wrapText: string = this.utils.breakText(box.name, box.width / 10);
    shape.attr({
      label: {
        text: wrapText,
      },
      xstampp: {
        projectId: box.projectId,
        parent: box.parent,
        type: box.boxType,
      },
    });
    this.graph.addCell(shape);
  }

  /**
   * Parses the box given from the service  to a shape object.
   */
  parseJSONtoJoint(id: string = this.navigationService.currentPoint.projectId): void {
    this.controlStructureController
      .getControlStructure(id)
      .pipe(
        take(1),
        tap(controlStructure => {
          this.controlStructure = controlStructure;
          controlStructure.boxes.forEach(box => this.parseShape(box));
          controlStructure.arrows.forEach(arrow =>
            this.link(
              arrow.source,
              arrow.destination,
              arrow.parts,
              arrow.label,
              arrow.type,
              arrow.projectId,
              arrow.parents,
              arrow.id
            )
          );
        })
      )
      .subscribe();
  }

  async createEntityHelper(data: ContextMenuData): Promise<number> {
    let ret: number;
    let req;
    if (data.shape === CSShape.BOX) {
      req = {
        boxId: data?.id,
        description: '',
        id: void 0,
        name: data?.name,
        projectId: this.navigationService?.currentPoint?.projectId,
        state: State.TODO,
      };
    } else {
      req = {
        arrowId: data?.id,
        description: '',
        id: void 0,
        name: data?.name,
        projectId: this.navigationService?.currentPoint?.projectId,
        state: State.TODO,
      };
    }
    switch (data?.type) {
      case ArrowAndBoxType.Actuator: {
        await this.controlStructureController
          .createActuator(req as Actuator)
          .then(s => (ret = s.id))
          .catch((err: Error) => this.messageService.info(err.message));
        break;
      }
      case ArrowAndBoxType.ControlAction: {
        await this.controlStructureController
          .createControlAction(req as ControlAction)
          .then(s => (ret = s?.id))
          .catch((err: Error) => this.messageService.info(err.message));
        break;
      }
      case ArrowAndBoxType.ControlledProcess: {
        await this.controlStructureController
          .createControlledProcess(req as ControlledProcess)
          .then(s => (ret = s?.id))
          .catch((err: Error) => this.messageService.info(err.message));
        break;
      }
      case ArrowAndBoxType.Controller: {
        await this.controlStructureController
          .createController(req as Controller)
          .then(s => (ret = s?.id))
          .catch((err: Error) => this.messageService.info(err.message));
        break;
      }
      case ArrowAndBoxType.DashedBox: {
        ret = -1;
        break;
      }
      case ArrowAndBoxType.Feedback: {
        await this.controlStructureController
          .createFeedback(req as Feedback)
          .then(s => (ret = s?.id))
          .catch((err: Error) => this.messageService.info(err.message));
        break;
      }
      case ArrowAndBoxType.Input: {
        await this.controlStructureController
          .createInput(req as OwnInput)
          .then(s => (ret = s?.id))
          .catch((err: Error) => this.messageService.info(err.message));
        break;
      }
      case ArrowAndBoxType.InputBox: {
        ret = -1;
        break;
      }
      case ArrowAndBoxType.Output: {
        await this.controlStructureController
          .createOutput(req as Output)
          .then(s => (ret = s?.id))
          .catch((err: Error) => this.messageService.info(err.message));
        break;
      }
      case ArrowAndBoxType.OutputBox: {
        ret = -1;
        break;
      }
      case ArrowAndBoxType.Sensor: {
        await this.controlStructureController
          .createSensor(req as Sensor)
          .then(s => (ret = s?.id))
          .catch((err: Error) => this.messageService.info(err.message));
        break;
      }
      case ArrowAndBoxType.TextBox: {
        ret = -1;
        break;
      }
    }
    return ret;
  }
}
