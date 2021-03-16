export enum State {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE',
}

export enum ProjectType {
  STPA = 'stpa',
  CAST = 'cast',
}

export enum Duration {
  IMMIDIATELY = 'immidiately',
  LONGTERM = 'long-term',
  EXTENSIVE = 'extensive',
}

export enum InformationFlowType {
  ControlAction = 'control-action',
  Feedback = 'feedback',
  Input = 'input',
  Output = 'output',
}

export enum SystemComponentType {
  Actuator = 'actuator',
  ControlledProcess = 'controlled-process',
  Controller = 'controller',
  Sensor = 'sensor',
}
