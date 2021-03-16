export interface Chip {
  readonly id: number | string;
  readonly parentId?: number;
  readonly label: string;
  readonly name: string;
  selected: boolean;
}

export enum ChipPrefix {
  Hazard = 'H-',
  Loss = 'L-',
  SystemConstraint = 'SC-',
  SubSystemConstraint = 'SSC-',
  SubHazard = 'SH-',
  ControlAction = 'CA-',
  Feedback = 'F-',
  Input = 'I-',
  Output = 'O-',
  UnsafeControlAction = 'UCA-',
  ProcessModel = 'PM-',
  ProcessVariable = 'PV-',
  Responsibility = 'R-',
  BoxInput = 'BI-',
  Actuator = 'A-',
  ControlledProcess = 'CP-',
  Controller = 'C-',
  Sensor = 'S-',
  ControllerConstraint = 'CC-',
  ControlAlgorithm = 'CAlg-',
  ConversionActuator = 'CV:A-',
  ConversionSensor = 'CV:S-',
  ImplementationConstraint = 'IC-',
  LossScenario = 'LS-',
  None = '',
}
