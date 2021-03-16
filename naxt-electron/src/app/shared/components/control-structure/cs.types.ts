export enum Direction {
  NE,
  SE,
  NW,
  SW,
  N,
  E,
  S,
  W,
}

export interface ContextMenuData {
  name?: string;
  type?: ArrowAndBoxType;
  shape?: CSShape;
  deleteEntityIds?: string[];
  alterEntityIds?: string[];
  labels?: string[];
  saveEntity?: boolean;
  projectId?: string;
  id: string;
}

export enum CSMode {
  CLOSE = 'CLOSE',
  CLOSE_EDIT = 'CLOSE_EDIT',
  EDIT = 'EDIT',
}

export enum ArrowAndBoxType {
  Sensor = 'Sensor',
  Actuator = 'Actuator',
  Controller = 'Controller',
  ControlledProcess = 'ControlledProcess',
  ControlAction = 'ControlAction',
  Feedback = 'Feedback',
  Output = 'Output',
  Input = 'Input',
  InputBox = 'InputBox',
  OutputBox = 'OutputBox',
  DashedBox = 'DashedBox',
  TextBox = 'TextBox',
}

export enum CSShape {
  BOX = 'Box',
  ARROW = 'Arrow',
}

export interface Coordinates {
  x: number | string;
  y: number | string;
}

export interface CSCoordinateData {
  paperSize: Coordinates;
  position: Coordinates;
}

export interface Box {
  id: string;
  name: string;
  projectId: string;
  type: string; // enum for types?
  x: number;
  y: number;
  height: number;
  width: number;
  parent: any; // type?
}

export interface Arrow {
  id: string;
  source: string;
  destination: string;
  projectId: string;
  label: string;
  type: string; // enum for types?
  parts: Coordinates[];
  parent: string;
}

export interface ControlStructure {
  projectId: string;
  svg: string;
  blackAndWhiteSVG: string;
  boxes: Box[];
  arrows: Arrow[];
}

export enum CSDiaType {
  STEP2 = 'STEP2',
  STEP4 = 'STEP4',
}

export interface ContextMenuData {
  name?: string;
  type?: ArrowAndBoxType;
  shape?: CSShape;
  deleteEntityIds?: string[];
  alterEntityIds?: string[];
  labels?: string[];
  saveEntity?: boolean;
  projectId?: string;
  id: string;
}

export enum ContextMenuMode {
  Link,
  Delete,
  Menu,
  New,
}

export interface EmtyShiDTO {
  irgendeinShit: string;
}

export enum CsToolbarMode {
  READONLY,
  CLOSED,
  OPEN,
}

export type CsCmDTO = EmtyShiDTO;
// | ControlledProcessDTO
// | ControlActionDTO
// | ControllerDTO
// | ActuatorDTO
// | SensorDTO
// | FeedbackDTO
// | OutputDTO
// | InputDTO;
