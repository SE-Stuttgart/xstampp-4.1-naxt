import { Arrow } from '@src-shared/control-structure/models/Arrow';
import { Box } from '@src-shared/control-structure/models/Box';

export class ControlStructure {
  readonly projectId: string;

  svg: string;
  blackAndWhiteSVG: string;

  boxes: Box[];
  arrows: Arrow[];

  constructor(projectId: string, svg: string, blackAndWhiteSVG: string, boxes: Box[], arrows: Arrow[]) {
    this.projectId = projectId;
    this.svg = svg;
    this.blackAndWhiteSVG = blackAndWhiteSVG;
    this.boxes = boxes;
    this.arrows = arrows;
  }
}
