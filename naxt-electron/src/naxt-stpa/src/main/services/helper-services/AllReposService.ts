import { inject, injectable } from 'inversify';
import {
  ActuatorRepo,
  ArrowRepo,
  BoxRepo,
  ControlActionRepo,
  ControlledProcessRepo,
  ControllerConstraintRepo,
  ControllerRepo,
  ConversionLastIdRepo,
  ConversionRepo,
  ConversionSensorLastIdRepo,
  ConversionSensorRepo,
  DiscreteProcessVariableValueRepo,
  FeedbackRepo,
  HazardLossLinkRepo,
  HazardRepo,
  HazardSystemConstraintLinkRepo,
  ImplementationConstraintRepo,
  InputRepo,
  LinkedDocumentsRepo,
  LossRepo,
  LossScenarioRepo,
  OutputRepo,
  ProcessModelProcessVariableLinkRepo,
  ProcessModelRepo,
  ProcessVariableRepo,
  ProcessVariableResponsibilityLinkRepo,
  ProjectEntityLastIdRepo,
  ProjectRepo,
  ResponsibilityRepo,
  ResponsibilitySubSystemConstraintLinkRepo,
  ResponsibilitySystemConstraintLinkRepo,
  RuleLastIdRepo,
  RuleRepo,
  SensorRepo,
  SubHazardLastIdRepo,
  SubHazardRepo,
  SubSystemConstraintLastIdRepo,
  SubSystemConstraintRepo,
  SystemConstraintRepo,
  SystemDescriptionRepo,
  UnsafeControlActionHazardLinkRepo,
  UnsafeControlActionLastIdRepo,
  UnsafeControlActionRepo,
  UnsafeControlActionSubHazardLinkRepo,
  VectorGraphicRepo,
} from '../../repositories';

@injectable()
export class AllReposService {
  public readonly actuatorRepo: ActuatorRepo;
  public readonly arrowRepo: ArrowRepo;
  public readonly boxRepo: BoxRepo;
  public readonly controlActionRepo: ControlActionRepo;
  public readonly controlledProcessRepo: ControlledProcessRepo;
  public readonly controllerConstraintRepo: ControllerConstraintRepo;
  public readonly controllerRepo: ControllerRepo;
  public readonly conversionLastIdRepo: ConversionLastIdRepo;
  public readonly conversionRepo: ConversionRepo;
  public readonly conversionSensorLastIdRepo: ConversionSensorLastIdRepo;
  public readonly conversionSensorRepo: ConversionSensorRepo;
  public readonly discreteProcessVariableValueRepo: DiscreteProcessVariableValueRepo;
  public readonly feedbackRepo: FeedbackRepo;
  public readonly hazardLossLinkRepo: HazardLossLinkRepo;
  public readonly hazardRepo: HazardRepo;
  public readonly hazardSystemConstraintLinkRepo: HazardSystemConstraintLinkRepo;
  public readonly implementationConstraintRepo: ImplementationConstraintRepo;
  public readonly inputRepo: InputRepo;
  public readonly lossRepo: LossRepo;
  public readonly lossScenarioRepo: LossScenarioRepo;
  public readonly outputRepo: OutputRepo;
  public readonly processModelProcessVariableLinkRepo: ProcessModelProcessVariableLinkRepo;
  public readonly processModelRepo: ProcessModelRepo;
  public readonly processVariableRepo: ProcessVariableRepo;
  public readonly processVariableResponsibilityLinkRepo: ProcessVariableResponsibilityLinkRepo;
  public readonly projectEntityLastIdRepo: ProjectEntityLastIdRepo;
  public readonly projectRepo: ProjectRepo;
  public readonly responsibilityRepo: ResponsibilityRepo;
  public readonly responsibilitySubSystemConstraintLinkRepo: ResponsibilitySubSystemConstraintLinkRepo;
  public readonly responsibilitySystemConstraintLinkRepo: ResponsibilitySystemConstraintLinkRepo;
  public readonly ruleLastIdRepo: RuleLastIdRepo;
  public readonly ruleRepo: RuleRepo;
  public readonly sensorRepo: SensorRepo;
  public readonly subHazardLastIdRepo: SubHazardLastIdRepo;
  public readonly subHazardRepo: SubHazardRepo;
  public readonly subSystemConstraintLastIdRepo: SubSystemConstraintLastIdRepo;
  public readonly subSystemConstraintRepo: SubSystemConstraintRepo;
  public readonly systemConstraintRepo: SystemConstraintRepo;
  public readonly systemDescriptionRepo: SystemDescriptionRepo;
  public readonly linkedDocumentsRepo: LinkedDocumentsRepo;
  public readonly unsafeControlActionHazardLinkRepo: UnsafeControlActionHazardLinkRepo;
  public readonly unsafeControlActionLastIdRepo: UnsafeControlActionLastIdRepo;
  public readonly unsafeControlActionRepo: UnsafeControlActionRepo;
  public readonly unsafeControlActionSubHazardLinkRepo: UnsafeControlActionSubHazardLinkRepo;
  public readonly vectorGraphicRepo: VectorGraphicRepo;

  constructor(
    @inject(ActuatorRepo)
    actuatorRepo: ActuatorRepo,
    @inject(ArrowRepo)
    arrowRepo: ArrowRepo,
    @inject(BoxRepo)
    boxRepo: BoxRepo,
    @inject(ControlActionRepo)
    controlActionRepo: ControlActionRepo,
    @inject(ControlledProcessRepo)
    controlledProcessRepo: ControlledProcessRepo,
    @inject(ControllerConstraintRepo)
    controllerConstraintRepo: ControllerConstraintRepo,
    @inject(ControllerRepo)
    controllerRepo: ControllerRepo,
    @inject(ConversionLastIdRepo)
    conversionLastIdRepo: ConversionLastIdRepo,
    @inject(ConversionRepo)
    conversionRepo: ConversionRepo,
    @inject(ConversionSensorLastIdRepo)
    conversionSensorLastIdRepo: ConversionSensorLastIdRepo,
    @inject(ConversionSensorRepo)
    conversionSensorRepo: ConversionSensorRepo,
    @inject(DiscreteProcessVariableValueRepo)
    discreteProcessVariableValueRepo: DiscreteProcessVariableValueRepo,
    @inject(FeedbackRepo)
    feedbackRepo: FeedbackRepo,
    @inject(HazardLossLinkRepo)
    hazardLossLinkRepo: HazardLossLinkRepo,
    @inject(HazardRepo)
    hazardRepo: HazardRepo,
    @inject(HazardSystemConstraintLinkRepo)
    hazardSystemConstraintLinkRepo: HazardSystemConstraintLinkRepo,
    @inject(ImplementationConstraintRepo)
    implementationConstraintRepo: ImplementationConstraintRepo,
    @inject(InputRepo)
    inputRepo: InputRepo,
    @inject(LossRepo)
    lossRepo: LossRepo,
    @inject(LossScenarioRepo)
    lossScenarioRepo: LossScenarioRepo,
    @inject(OutputRepo)
    outputRepo: OutputRepo,
    @inject(ProcessModelProcessVariableLinkRepo)
    processModelProcessVariableLinkRepo: ProcessModelProcessVariableLinkRepo,
    @inject(ProcessModelRepo)
    processModelRepo: ProcessModelRepo,
    @inject(ProcessVariableRepo)
    processVariableRepo: ProcessVariableRepo,
    @inject(ProcessVariableResponsibilityLinkRepo)
    processVariableResponsibilityLinkRepo: ProcessVariableResponsibilityLinkRepo,
    @inject(ProjectEntityLastIdRepo)
    projectEntityLastIdRepo: ProjectEntityLastIdRepo,
    @inject(ProjectRepo)
    projectRepo: ProjectRepo,
    @inject(ResponsibilityRepo)
    responsibilityRepo: ResponsibilityRepo,
    @inject(ResponsibilitySubSystemConstraintLinkRepo)
    responsibilitySubSystemConstraintLinkRepo: ResponsibilitySubSystemConstraintLinkRepo,
    @inject(ResponsibilitySystemConstraintLinkRepo)
    responsibilitySystemConstraintLinkRepo: ResponsibilitySystemConstraintLinkRepo,
    @inject(RuleLastIdRepo)
    ruleLastIdRepo: RuleLastIdRepo,
    @inject(RuleRepo)
    ruleRepo: RuleRepo,
    @inject(SensorRepo)
    sensorRepo: SensorRepo,
    @inject(SubHazardLastIdRepo)
    subHazardLastIdRepo: SubHazardLastIdRepo,
    @inject(SubHazardRepo)
    subHazardRepo: SubHazardRepo,
    @inject(SubSystemConstraintLastIdRepo)
    subSystemConstraintLastIdRepo: SubSystemConstraintLastIdRepo,
    @inject(SubSystemConstraintRepo)
    subSystemConstraintRepo: SubSystemConstraintRepo,
    @inject(SystemConstraintRepo)
    systemConstraintRepo: SystemConstraintRepo,
    @inject(SystemDescriptionRepo)
    systemDescriptionRepo: SystemDescriptionRepo,
    @inject(LinkedDocumentsRepo)
    linkedDocumentsRepo: LinkedDocumentsRepo,
    @inject(UnsafeControlActionHazardLinkRepo)
    unsafeControlActionHazardLinkRepo: UnsafeControlActionHazardLinkRepo,
    @inject(UnsafeControlActionLastIdRepo)
    unsafeControlActionLastIdRepo: UnsafeControlActionLastIdRepo,
    @inject(UnsafeControlActionRepo)
    unsafeControlActionRepo: UnsafeControlActionRepo,
    @inject(UnsafeControlActionSubHazardLinkRepo)
    unsafeControlActionSubHazardLinkRepo: UnsafeControlActionSubHazardLinkRepo,
    @inject(VectorGraphicRepo)
    vectorGraphicRepo: VectorGraphicRepo
  ) {
    this.actuatorRepo = actuatorRepo;
    this.arrowRepo = arrowRepo;
    this.boxRepo = boxRepo;
    this.controlActionRepo = controlActionRepo;
    this.controlledProcessRepo = controlledProcessRepo;
    this.controllerConstraintRepo = controllerConstraintRepo;
    this.controllerRepo = controllerRepo;
    this.conversionLastIdRepo = conversionLastIdRepo;
    this.conversionRepo = conversionRepo;
    this.conversionSensorLastIdRepo = conversionSensorLastIdRepo;
    this.conversionSensorRepo = conversionSensorRepo;
    this.discreteProcessVariableValueRepo = discreteProcessVariableValueRepo;
    this.feedbackRepo = feedbackRepo;
    this.hazardLossLinkRepo = hazardLossLinkRepo;
    this.hazardRepo = hazardRepo;
    this.hazardSystemConstraintLinkRepo = hazardSystemConstraintLinkRepo;
    this.implementationConstraintRepo = implementationConstraintRepo;
    this.inputRepo = inputRepo;
    this.lossRepo = lossRepo;
    this.lossScenarioRepo = lossScenarioRepo;
    this.outputRepo = outputRepo;
    this.processModelProcessVariableLinkRepo = processModelProcessVariableLinkRepo;
    this.processModelRepo = processModelRepo;
    this.processVariableRepo = processVariableRepo;
    this.processVariableResponsibilityLinkRepo = processVariableResponsibilityLinkRepo;
    this.projectEntityLastIdRepo = projectEntityLastIdRepo;
    this.projectRepo = projectRepo;
    this.responsibilityRepo = responsibilityRepo;
    this.responsibilitySubSystemConstraintLinkRepo = responsibilitySubSystemConstraintLinkRepo;
    this.responsibilitySystemConstraintLinkRepo = responsibilitySystemConstraintLinkRepo;
    this.ruleLastIdRepo = ruleLastIdRepo;
    this.ruleRepo = ruleRepo;
    this.sensorRepo = sensorRepo;
    this.subHazardLastIdRepo = subHazardLastIdRepo;
    this.subHazardRepo = subHazardRepo;
    this.subSystemConstraintLastIdRepo = subSystemConstraintLastIdRepo;
    this.subSystemConstraintRepo = subSystemConstraintRepo;
    this.systemConstraintRepo = systemConstraintRepo;
    this.systemDescriptionRepo = systemDescriptionRepo;
    this.linkedDocumentsRepo = linkedDocumentsRepo;
    this.unsafeControlActionHazardLinkRepo = unsafeControlActionHazardLinkRepo;
    this.unsafeControlActionLastIdRepo = unsafeControlActionLastIdRepo;
    this.unsafeControlActionRepo = unsafeControlActionRepo;
    this.unsafeControlActionSubHazardLinkRepo = unsafeControlActionSubHazardLinkRepo;
    this.vectorGraphicRepo = vectorGraphicRepo;
  }
}
