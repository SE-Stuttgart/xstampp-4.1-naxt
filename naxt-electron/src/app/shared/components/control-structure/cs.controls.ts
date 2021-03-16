import { HostListener, Directive } from '@angular/core';
import { AppNavigationService } from '@core/services/app-navigation/app-navigation.service';
import { MessageService } from '@core/services/message/message.service';
import { ControlStructure } from '@src-shared/control-structure/models';
import * as joint from 'jointjs';
import * as $ from 'jquery';
import * as SvgPanZoom from 'svg-pan-zoom';
import { ArrowAndBoxType, ContextMenuData, CSCoordinateData, CSMode, CSShape, Direction } from './cs.types';
import { CsUtils } from './csutils/cs.utils';
import { ShapeUtils } from './csutils/shape-utils';
import { dia } from 'jointjs';
import Link = dia.Link;

@Directive()
export class CSControls {
  utils: CsUtils;
  shapeUtils: ShapeUtils;
  graph: joint.dia.Graph;
  paper: joint.dia.Paper;
  private _mode: CSMode = CSMode.CLOSE;
  csCoordinateData: CSCoordinateData = { paperSize: null, position: null };
  private customHighlighter: any;
  panAndZoom: SvgPanZoom.Instance;
  csContextmenu: boolean = false;
  csContextmenuData: ContextMenuData;

  private resizeElement: any;
  private last: MouseEvent;

  private csCmTarget: joint.dia.CellView;
  isEditable: boolean = false;
  highlightMode: boolean = false;
  mouseDown: boolean = false;
  direction: Direction;

  arrowType: string;
  arrowId: string | number;

  get isOpen(): boolean {
    return this._mode === CSMode.EDIT;
  }

  constructor(readonly navigationService: AppNavigationService, readonly messageService: MessageService) {
    this.utils = new CsUtils();
    this.shapeUtils = new ShapeUtils();
    this.graph = this.shapeUtils.getGraph();
  }

  initControlStructure(): void {
    this.paper = new joint.dia.Paper({
      el: $('#paper'),
      height: 'calc(100% - 4px)',
      width: '100%',
      model: this.graph,
      perpendicularLinks: true,
      interactive: false,
      background: {
        color: 'white',
      },
    });

    this.initPanAndZoom();
    this.addPaperOnClicks();
  }

  unlockInteraction(): void {
    this.paper.setInteractivity(true);
    // this.panAndZoom.enableDblClickZoom();
    this.panAndZoom.enableZoom();
    this.panAndZoom.enablePan();
  }

  lockInteraction(lockJointSVG: boolean = true): void {
    if (lockJointSVG) {
      this.paper.setInteractivity(false);
    }
    // this.panAndZoom.disableDblClickZoom();
    this.panAndZoom.disableZoom();
    this.panAndZoom.disablePan();
  }
  /**
   * Manual way to resize a box in Joint without using Rappid
   * @param data: dto from the contextmenu
   */
  resizeBox(data: ContextMenuData): void {
    this.csContextmenu = false;
    this.unlockInteraction();
    this.resizeElement = this.graph.getCell(data.id);
    const element: joint.dia.Element = new this.shapeUtils.GrabHandles();
    element.position(this.resizeElement.attributes.position.x, this.resizeElement.attributes.position.y);
    element.resize(this.resizeElement.attributes.size.width, this.resizeElement.attributes.size.height);
    element.attr({
      label: {
        pointerEvents: 'none',
        visibility: 'visible',
        text: '',
      },
      body: {
        cursor: 'default',
        visibility: 'hidden',
      },
      buttonNE: {
        event: 'element:resize-ne:pointerdown',
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
      },
      buttonLabelNE: {
        text: ' ',
        fill: 'black',
        fontSize: 8,
        fontWeight: 'bold',
      },
      buttonN: {
        event: 'element:resize-n:pointerdown',
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
      },
      buttonLabelN: {
        text: ' ',
        fill: 'black',
        fontSize: 8,
        fontWeight: 'bold',
      },
      buttonS: {
        event: 'element:resize-s:pointerdown',
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
      },
      buttonLabelS: {
        text: ' ',
        fill: 'black',
        fontSize: 8,
        fontWeight: 'bold',
      },
      buttonW: {
        event: 'element:resize-w:pointerdown',
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
      },
      buttonLabelW: {
        text: ' ',
        fill: 'black',
        fontSize: 8,
        fontWeight: 'bold',
      },
      buttonE: {
        event: 'element:resize-e:pointerdown',
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
      },
      buttonLabelE: {
        text: ' ',
        fill: 'black',
        fontSize: 8,
        fontWeight: 'bold',
      },
      buttonSE: {
        event: 'element:resize-se:pointerdown',
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
      },
      buttonLabelSE: {
        text: ' ',
        fill: 'black',
        fontSize: 8,
        fontWeight: 'bold',
      },
      buttonSW: {
        event: 'element:resize-sw:pointerdown',
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
      },
      buttonLabelSW: {
        text: ' ',
        fill: 'black',
        fontSize: 8,
        fontWeight: 'bold',
      },
      buttonNW: {
        event: 'element:resize-nw:pointerdown',
        fill: 'black',
        stroke: 'black',
        strokeWidth: 2,
      },
      buttonLabelNW: {
        text: ' ',
        fill: 'black',
        fontSize: 8,
        fontWeight: 'bold',
      },
      buttonCancel: {
        event: 'element:resize-ok:pointerdown',
        fill: 'green',
        stroke: 'black',
        strokeWidth: 2,
      },
      buttonLabelCancel: {
        text: 'OK',
        fill: 'black',
        fontSize: 8,
        fontWeight: 'bold',
      },
    });
    element.addTo(this.graph);
    this.resizeElement.on('change:size', (_elemente: joint.dia.Element) => {
      element.position(this.resizeElement.attributes.position.x, this.resizeElement.attributes.position.y);
      element.resize(this.resizeElement.attributes.size.width, this.resizeElement.attributes.size.height);
    });
    this.resizeElement.embed(element);
    this.paper.on('element:resize-ne:pointerdown', (elementView: joint.dia.ElementView, evt: MouseEvent) => {
      this.mouseDown = true;
      this.last = evt;
      this.direction = Direction.NE;
    });
    this.paper.on('element:resize-se:pointerdown', (elementView: joint.dia.ElementView, evt: MouseEvent) => {
      this.mouseDown = true;
      this.last = evt;
      this.direction = Direction.SE;
    });
    this.paper.on('element:resize-sw:pointerdown', (elementView: joint.dia.ElementView, evt: MouseEvent) => {
      this.mouseDown = true;
      this.last = evt;
      this.direction = Direction.SW;
    });
    this.paper.on('element:resize-nw:pointerdown', (elementView: joint.dia.ElementView, evt: MouseEvent) => {
      this.mouseDown = true;
      this.last = evt;
      this.direction = Direction.NW;
    });
    this.paper.on('element:resize-n:pointerdown', (elementView: joint.dia.ElementView, evt: MouseEvent) => {
      this.mouseDown = true;
      this.last = evt;
      this.direction = Direction.N;
    });
    this.paper.on('element:resize-e:pointerdown', (elementView: joint.dia.ElementView, evt: MouseEvent) => {
      this.mouseDown = true;
      this.last = evt;
      this.direction = Direction.E;
    });
    this.paper.on('element:resize-s:pointerdown', (elementView: joint.dia.ElementView, evt: MouseEvent) => {
      this.mouseDown = true;
      this.last = evt;
      this.direction = Direction.S;
    });
    this.paper.on('element:resize-w:pointerdown', (elementView: joint.dia.ElementView, evt: MouseEvent) => {
      this.mouseDown = true;
      this.last = evt;
      this.direction = Direction.W;
    });
    this.paper.on('element:resize-ok:pointerdown', (_elementView: joint.dia.ElementView, _evt: MouseEvent) => {
      element.remove();
    });
  }

  addPaperOnClicks(): void {
    this.paper.on('cell:contextmenu', (cellView: joint.dia.CellView, evt: JQuery.Event, x: number, y: number): void => {
      if ((this.paper.options.interactive || this.csContextmenu) && cellView) {
        let type: string;
        let shape: CSShape;
        if (cellView.model.attributes.type === 'org.Arrow') {
          type = cellView.model.attributes.attrs.xstampp.type;
          shape = CSShape.ARROW;
        } else if (cellView.model.attributes.type.includes('Shape') || cellView.model.attributes.type.includes('Box')) {
          type = cellView.model.attributes.attrs.xstampp.type;
          shape = CSShape.BOX;
        }
        this.lockInteraction();
        const pan: SvgPanZoom.Point = this.panAndZoom.getPan();
        const zoom: number = this.panAndZoom.getZoom();
        if (pan.x !== 0 || pan.y !== 0 || zoom !== 1) {
          this.csCoordinateData.position.x = x * zoom + pan.x;
          this.csCoordinateData.position.y = y * zoom + pan.y;
        } else {
          this.csCoordinateData.position.x = x;
          this.csCoordinateData.position.y = y;
        }
        this.csCoordinateData.paperSize.x = this.paper.options.width;
        this.csCoordinateData.paperSize.y = this.paper.options.height;
        this.csContextmenu = true;
        this.csContextmenuData = {
          type: ArrowAndBoxType[type],
          shape: shape,
          projectId: this.navigationService.currentPoint.projectId,
          id: cellView.model.id as string,
        };
        // saves the ref of the clicked cell, for zooming in STEP4
        this.csCmTarget = cellView;
      }
    });

    /**
     * close contextmenu on blank click
     */
    this.paper.on('blank:pointerclick', () => {
      if (this.csContextmenu) {
        this.csContextmenu = false;
        this.unlockInteraction();
      }
    });

    /**
     * close contextmenu on blank rightclick
     */
    this.paper.on('blank:contextmenu', () => {
      if (this.csContextmenu) {
        this.csContextmenu = false;
        this.unlockInteraction();
      }
    });

    /**
     * on link (arrow) click
     */
    this.paper.on('link:pointerdown', () => {
      if (this.isEditable) {
        this.lockInteraction(false);
      }
    });

    this.paper.on('link:pointerup', () => {
      if (this.isEditable) {
        this.unlockInteraction();
      }
    });

    /**
     * on any element click
     */
    this.paper.on('element:pointerdown', (cellView: joint.dia.CellView) => {
      if (this.isEditable) {
        this.lockInteraction(false);
      }
      if (this.highlightMode) {
        this.highlightCell(cellView.model);
      } else {
        if (this.paper.options.interactive) {
          this.highlightCell(cellView.model);
        }
      }
    });
    // sets the arrow
    this.paper.on('element:pointerup', (cellView: joint.dia.CellView) => {
      if (this.isEditable) {
        this.unlockInteraction();
      }
      if (this.highlightMode && this.isEditable) {
        if (
          this.utils.isValidPlacement(
            ArrowAndBoxType[this.arrowType],
            this.utils.jointTypeToArrowAndBoxType(cellView.model.attributes.type),
            false
          )
        ) {
          // let target: string;
          // let source: string;
          const source = this.arrowId as string;
          const target = cellView.model.id as string;

          if (target !== source) {
            this.unHighlightCell(this.graph.getCell(this.arrowId));
            this.link(
              source,
              target,
              new Array<number>(),
              '',
              this.arrowType,
              cellView.model.attributes.attrs.xstampp.projectId,
              undefined
            );
            this.unHighlightCell(cellView.model);
            this.highlightMode = false;
          } else {
            this.unHighlightCell(this.graph.getCell(this.arrowId));
            this.highlightMode = false;
            this.messageService.info('Placement failed');
          }
        } else {
          this.unHighlightCell(this.graph.getCell(this.arrowId));
          this.unHighlightCell(cellView.model);
          this.highlightMode = false;

          this.messageService.info('Placement failed');
        }
      } else {
        this.unHighlightCell(cellView.model);
      }
    });
  }

  zoom(zoomIn: boolean): void {
    this.csContextmenu = false;
    this.unlockInteraction();
    if (zoomIn) {
      this.panAndZoom.zoomIn();
    } else {
      this.panAndZoom.zoomOut();
    }
  }

  link(
    source: string,
    target: string,
    parts: number[],
    label: string,
    type: string,
    projectId: string,
    parent: string,
    id?: string
  ): joint.dia.Cell {
    const labels: string[] = label.split('@!?@'); // the seperator for the abels
    const dist: number = 100 / labels.length;
    const offset: number = dist / 2;
    let color: string;
    parts = parts ?? [];
    if (type === 'Feedback') {
      color = '#00ff00';
    } else if (type === 'ControlAction') {
      color = '#ffc700';
    } else {
      color = '#000000';
    }
    let cell: joint.shapes.org.Arrow;
    if (id) {
      cell = new joint.shapes.org.Arrow({
        id: id,
      });
    } else {
      cell = new joint.shapes.org.Arrow();
    }
    cell.source({ id: source });
    cell.target({ id: target });
    cell.attr({
      '.connection': {
        fill: 'none',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        stroke: '#000000',
      },
      '.marker-target': {
        type: 'path',
        stroke: 'black',
        fill: color,
        d: 'M 10 -5 0 0 10 5 Z',
      },
      // '.marker-arrowhead': {
      //   display: 'none',
      // },
      '.link-tools': {
        display: 'none',
      },
      'tool-remove': {
        display: 'none',
      },
    });

    labels
      .filter((ele: string) => ele.length > 0)
      .forEach((ele: string, i: number) => {
        /**
         * FIXME: fucking stupid. Saves the postion of each arrow label in a string like:
         *
         * 'label'@?!@'distance'o'offset'
         * Would be better to use a link table for boxes and arrows with the id of the parentobject. But to do this
         * you would need to refactor the whole controlstructure in back- and frontend.
         */

        cell.label(i, {
          attrs: {
            text: {
              text: ele.split('@?!@')[0] ? this.utils.breakText(ele.split('@?!@')[0], 15) : '',
            },
          },
          position: {
            distance:
              ele.split('@?!@')[1] && ele.split('@?!@')[1].split('o')[0]
                ? +ele.split('@?!@')[1].split('o')[0]
                : (i * dist + offset) / 110,
            offset: ele.split('@?!@')[1] && ele.split('@?!@')[1].split('o')[1] && +ele.split('@?!@')[1].split('o')[1],
          },
        });
      });

    cell.attr({
      xstampp: {
        type: type,
        projectId: projectId,
        parent: parent,
      },
    });

    const vertices: joint.dia.Link.Vertex[] = [];
    for (let i = 0; i < parts.length - 1; i = i + 2) {
      vertices.push({ x: parts[i], y: parts[i + 1] });
    }
    cell.vertices(vertices);
    this.graph.addCell(cell);
    return cell;
  }

  unHighlightCell(cell: joint.dia.Cell): void {
    if (this.utils.isSafari) {
      const cellView: joint.dia.ElementView = this.paper.findViewByModel(cell);
      cellView.unhighlight(null, this.customHighlighter);
    } else {
      cell.removeAttr('body/filter');
    }
  }

  highlightCell(cell: joint.dia.Cell): void {
    if (this.isEditable) {
      if (this.utils.isSafari) {
        const cellView: joint.dia.ElementView = this.paper.findViewByModel(cell);
        cellView.highlight(null, this.customHighlighter);
      } else {
        cell.attr({
          body: {
            filter: {
              name: 'highlight',
              args: {
                color: 'black',
                width: 4,
                opacity: 0.5,
                blur: 5,
              },
            },
          },
        });
      }
    }
  }

  initPanAndZoom(): void {
    this.csCoordinateData.paperSize = {
      x: this.paper.options.width,
      y: this.paper.options.height,
    };
    this.csCoordinateData.position = { x: 0, y: 0 };
    this.customHighlighter = {
      highlighter: {
        name: 'stroke',
        options: {
          padding: 6,
          attrs: {
            'stroke-width': 6,
            stroke: '#000000',
            opacity: 0.5,
          },
        },
      },
    };

    const options: SvgPanZoom.Options = {
      viewportSelector: '.joint-viewport',
      center: false,
      zoomEnabled: true,
      panEnabled: true,
      dblClickZoomEnabled: false,
      fit: false,
      minZoom: 0.5,
      maxZoom: 2,
      zoomScaleSensitivity: 0.5,
    };

    const svgId: string = document.getElementById('paper').children[2].id;
    this.panAndZoom = SvgPanZoom('#' + svgId, options);
  }

  edit(): boolean {
    this._mode = CSMode.EDIT;
    return true;
  }

  close(): void {
    this._mode = CSMode.CLOSE_EDIT;
  }

  save(): boolean {
    this._mode = CSMode.CLOSE;
    return true;
  }

  @HostListener('mouseup')
  onMouseup(): void {
    this.mouseDown = false;
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent): void {
    /**
     * resizes the box with the drag event of the graph-handles
     */
    if (this.mouseDown) {
      event.stopPropagation(); // stops propagation, cause the "object" would be moved
      event.preventDefault(); // stops default, cause the "graph-handle-box" would move instead of the resizing effect

      // min width and height for the Box-objects
      const MIN_WIDTH: number = 100;
      const MIN_HEIGHT: number = 50;
      switch (this.direction) {
        case Direction.SE: {
          const opt: { direction: string } = { direction: 'bottom-right' };
          const x: number = this.resizeElement.attributes.size.width + event.clientX - this.last.clientX;
          const y: number = this.resizeElement.attributes.size.height + event.clientY - this.last.clientY;
          this.resizeElement.resize(x > MIN_WIDTH ? x : MIN_WIDTH, y > MIN_HEIGHT ? y : MIN_HEIGHT, opt);
          break;
        }

        case Direction.NE: {
          const opt: { direction: string } = { direction: 'top-right' };
          const x: number = this.resizeElement.attributes.size.width + event.clientX - this.last.clientX;
          const y: number = this.resizeElement.attributes.size.height - (event.clientY - this.last.clientY);
          this.resizeElement.resize(x > MIN_WIDTH ? x : MIN_WIDTH, y > MIN_HEIGHT ? y : MIN_HEIGHT, opt);
          break;
        }

        case Direction.NW: {
          const opt: { direction: string } = { direction: 'top-left' };
          const x: number = this.resizeElement.attributes.size.width - (event.clientX - this.last.clientX);
          const y: number = this.resizeElement.attributes.size.height - (event.clientY - this.last.clientY);
          this.resizeElement.resize(x > MIN_WIDTH ? x : MIN_WIDTH, y > MIN_HEIGHT ? y : MIN_HEIGHT, opt);
          break;
        }

        case Direction.SW: {
          const opt: { direction: string } = { direction: 'bottom-left' };
          const x: number = this.resizeElement.attributes.size.width - (event.clientX - this.last.clientX);
          const y: number = this.resizeElement.attributes.size.height + event.clientY - this.last.clientY;
          this.resizeElement.resize(x > MIN_WIDTH ? x : MIN_WIDTH, y > MIN_HEIGHT ? y : MIN_HEIGHT, opt);
          break;
        }

        case Direction.N: {
          const opt: { direction: string } = { direction: 'top' };
          const y: number = this.resizeElement.attributes.size.height - (event.clientY - this.last.clientY);
          y > MIN_HEIGHT && this.resizeElement.resize(this.resizeElement.attributes.size.width, y, opt);
          break;
        }

        case Direction.E: {
          const opt: { direction: string } = { direction: 'right' };
          const x: number = this.resizeElement.attributes.size.width + (event.clientX - this.last.clientX);
          x > MIN_WIDTH && this.resizeElement.resize(x, this.resizeElement.attributes.size.height, opt);
          break;
        }

        case Direction.S: {
          const opt: { direction: string } = { direction: 'bottom' };
          const y: number = this.resizeElement.attributes.size.height + (event.clientY - this.last.clientY);
          y > MIN_HEIGHT && this.resizeElement.resize(this.resizeElement.attributes.size.width, y, opt);
          break;
        }

        case Direction.W: {
          const opt: { direction: string } = { direction: 'left' };
          const x: number = this.resizeElement.attributes.size.width - (event.clientX - this.last.clientX);
          x > MIN_WIDTH && this.resizeElement.resize(x, this.resizeElement.attributes.size.height, opt);
          break;
        }
      }

      this.last = event;
    }
  }
}
