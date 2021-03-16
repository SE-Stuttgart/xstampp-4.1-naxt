export interface Chip {
  readonly id: string;
  readonly label: string;
  readonly name: string;
  selected: boolean;
}

export enum ChipPrefix {
  Hazard = 'H-',
  Constraint = 'C-',
  Event = 'E-',
  ControlAction = 'CA-',
  Feedback = 'F-',
  Input = 'I-',
  Output = 'O-',
  Actuator = 'A-',
  ControlledProcess = 'CP-',
  Controller = 'CR-',
  Sensor = 'S-',
  Responsibility = 'R-',
  RoleInTheAccident = 'RIA:',
  CommunicationAndCoordination = 'CC-',
  SafetyCulture = 'SC-',
  SafetyInformation = 'SI-',
  SafetyManagement = 'SM-',
  ChangesAndDynamicsOverTime = 'CDT-',
  InternalAndExternalEconomics = 'IEE-',
  Recommendation = 'RE-',
  SubRecommendation = 'SRE-',
  QuestionAndAnswer = 'QnA-',
}
