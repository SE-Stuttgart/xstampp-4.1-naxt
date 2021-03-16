import { State } from '@src-shared/Enums';
import { Described, Named, ProjectDependent, Stated } from '@src-shared/Interfaces';

export enum HeadCategory {
  FailureRelatedToController = 'Failures related to the controller (for physical controllers)',
  InadequateControlAlgorithm = 'Inadequate control algorithm',
  UnsafeControlInput = 'Unsafe control input',
  InadequateProcessModel = 'Inadequate process model',

  None = '',
}

export enum SubCategory {
  // InadequateControlAlgorithm
  ControlAlgorithmFlawedImplementation = 'Flawed implementation of the specified control algorithm',
  ControlAlgorithmFlawed = 'The specified control algorithm is flawed',
  ControlAlgorithmDegradesOverTime = 'The specified control algorithm becomes inadequate over time due to changes or degradation',
  ControlAlgorithmAttacked = 'The control algorithm is changed by an attacker',

  // UnsafeControlInput
  UnsafeControlActionReceived = 'UCA received from another controller (already addressed when considering UCAs from other controllers)',

  // InadequateProcessModel
  ControllerReceivedIncorrectFeedback = 'Controller receives incorrect feedback/information ',
  ControllerInterpretsCorrectFeedbackWrong = 'Controller receives correct feedback/information but interprets it incorrectly or ignores it',
  ControllerNotReceivedFeedback = 'Controller does not receive feedback/information when needed (delayed or never received)',

  None = '',
}

export enum Reason {
  FeedbackSendButNotReceivedByController = 'Feedback/info sent by sensors(s) but not received by controller',
  FeedbackNotSendButReceivedOrAppliedBySensor = 'Feedback/info is not sent by sensor(s) but is received or applied to sensor(s)',
  FeedbackNotReceivedOrAppliedBySensor = 'Feedback/info is not received or applied to sensor(s)',
  FeedbackNotExistsInControlStructureOrSensor = 'Feedback/info does not exist in control structure or sensor(s) do not exist',

  SensorRespondsAdequately = 'Sensor(s) respond adequately but controller receives inadequate feedback/info',
  SensorNotDesignedForNecessaryFeedback = 'Sensor(s) are not capable or not designed to provide necessary feedback/info',
  SensorRespondsInadequately = 'Sensor(s) respond inadequately to feedback/info that is received or applied to sensor(s)',

  None = '',
}

export class LossScenario implements ProjectDependent, Named, Described, Stated {
  readonly id: number = -1;
  readonly projectId: string = '';

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;

  readonly ucaId: number = -1;
  readonly headCategory: HeadCategory = HeadCategory.None;
  readonly subCategory: SubCategory = SubCategory.None;
  readonly controller1Id: number = null;
  readonly controller2Id: number = null;
  readonly controlAlgorithm: number = null;
  readonly description1: string = '';
  readonly description2: string = '';
  readonly description3: string = '';
  readonly controlActionId: number = null;
  readonly inputArrowId: number = null;
  readonly feedbackArrowId: number = null;
  readonly inputBoxId: string = '';
  readonly sensorId: number = null;
  readonly reason: Reason = Reason.None;
}
