import * as _ from '@cast/src/main/repositories';
import { inject, injectable } from 'inversify';

@injectable()
export class AllReposService {
  public readonly changesAndDynamicsOverTimeDescriptionRepo: _.ChangesAndDynamicsOverTimeDescriptionRepo;
  public readonly communicationAndCoordinationDescriptionRepo: _.CommunicationAndCoordinationDescriptionRepo;
  public readonly internalAndExternalEconomicsDescriptionRepo: _.InternalAndExternalEconomicsDescriptionRepo;
  public readonly safetyCultureDescriptionRepo: _.SafetyCultureDescriptionRepo;
  public readonly safetyInformationSystemDescriptionRepo: _.SafetyInformationSystemDescriptionRepo;
  public readonly safetyManagementSystemDescriptionRepo: _.SafetyManagementSystemDescriptionRepo;
  public readonly constraintHazardLinkRepo: _.ConstraintHazardLinkRepo;
  public readonly constraintResponsibilityLinkRepo: _.ConstraintResponsibilityLinkRepo;
  public readonly controllerResponsibilityLinkRepo: _.ControllerResponsibilityLinkRepo;
  public readonly changesAndDynamicsOverTimeControllerLinkRepo: _.ChangesAndDynamicsOverTimeControllerLinkRepo;
  public readonly communicationAndCoordinationController1LinkRepo: _.CommunicationAndCoordinationController1LinkRepo;
  public readonly communicationAndCoordinationController2LinkRepo: _.CommunicationAndCoordinationController2LinkRepo;
  public readonly internalAndExternalEconomicsControllerLinkRepo: _.InternalAndExternalEconomicsControllerLinkRepo;
  public readonly safetyCultureControllerLinkRepo: _.SafetyCultureControllerLinkRepo;
  public readonly safetyInformationSystemControllerLinkRepo: _.SafetyInformationSystemControllerLinkRepo;
  public readonly safetyManagementSystemControllerLinkRepo: _.SafetyManagementSystemControllerLinkRepo;
  public readonly controlActionRepo: _.ControlActionRepo;
  public readonly feedbackRepo: _.FeedbackRepo;
  public readonly inputRepo: _.InputRepo;
  public readonly outputRepo: _.OutputRepo;
  public readonly actuatorRepo: _.ActuatorRepo;
  public readonly controlledProcessRepo: _.ControlledProcessRepo;
  public readonly controllerRepo: _.ControllerRepo;
  public readonly sensorRepo: _.SensorRepo;
  public readonly accidentDescriptionRepo: _.AccidentDescriptionRepo;
  public readonly arrowRepo: _.ArrowRepo;
  public readonly boxRepo: _.BoxRepo;
  public readonly changesAndDynamicsOverTimeRepo: _.ChangesAndDynamicsOverTimeRepo;
  public readonly communicationAndCoordinationRepo: _.CommunicationAndCoordinationRepo;
  public readonly constraintRepo: _.ConstraintRepo;
  public readonly eventRepo: _.EventRepo;
  public readonly hazardRepo: _.HazardRepo;
  public readonly internalAndExternalEconomicsRepo: _.InternalAndExternalEconomicsRepo;
  public readonly otherFactorsRepo: _.OtherFactorsRepo;
  public readonly processVariableRepo: _.ProcessVariableRepo;
  public readonly projectRepo: _.ProjectRepo;
  public readonly questionAndAnswersRepo: _.QuestionAndAnswersRepo;
  public readonly recommendationRepo: _.RecommendationRepo;
  public readonly responsibilityRepo: _.ResponsibilityRepo;
  public readonly roleInTheAccidentRepo: _.RoleInTheAccidentRepo;
  public readonly safetyCultureRepo: _.SafetyCultureRepo;
  public readonly safetyInformationSystemRepo: _.SafetyInformationSystemRepo;
  public readonly safetyManagementSystemRepo: _.SafetyManagementSystemRepo;
  public readonly subRecommendationRepo: _.SubRecommendationRepo;
  public readonly systemDescriptionRepo: _.SystemDescriptionRepo;
  public readonly lastIdRepo: _.LastIdRepo;
  public readonly questionComponentLinkRepo: _.QuestionComponentLinkRepo;
  public readonly vectorGraphicRepo: _.VectorGraphicRepo;

  constructor(
    @inject(_.ChangesAndDynamicsOverTimeDescriptionRepo)
    changesAndDynamicsOverTimeDescriptionRepo: _.ChangesAndDynamicsOverTimeDescriptionRepo,
    @inject(_.CommunicationAndCoordinationDescriptionRepo)
    communicationAndCoordinationDescriptionRepo: _.CommunicationAndCoordinationDescriptionRepo,
    @inject(_.InternalAndExternalEconomicsDescriptionRepo)
    internalAndExternalEconomicsDescriptionRepo: _.InternalAndExternalEconomicsDescriptionRepo,
    @inject(_.SafetyCultureDescriptionRepo)
    safetyCultureDescriptionRepo: _.SafetyCultureDescriptionRepo,
    @inject(_.SafetyInformationSystemDescriptionRepo)
    safetyInformationSystemDescriptionRepo: _.SafetyInformationSystemDescriptionRepo,
    @inject(_.SafetyManagementSystemDescriptionRepo)
    safetyManagementSystemDescriptionRepo: _.SafetyManagementSystemDescriptionRepo,
    @inject(_.ConstraintHazardLinkRepo)
    constraintHazardLinkRepo: _.ConstraintHazardLinkRepo,
    @inject(_.ConstraintResponsibilityLinkRepo)
    constraintResponsibilityLinkRepo: _.ConstraintResponsibilityLinkRepo,
    @inject(_.ControllerResponsibilityLinkRepo)
    controllerResponsibilityLinkRepo: _.ControllerResponsibilityLinkRepo,
    @inject(_.ChangesAndDynamicsOverTimeControllerLinkRepo)
    changesAndDynamicsOverTimeLinkRepo: _.ChangesAndDynamicsOverTimeControllerLinkRepo,
    @inject(_.CommunicationAndCoordinationController1LinkRepo)
    communicationAndCoordinationController1LinkRepo: _.CommunicationAndCoordinationController1LinkRepo,
    @inject(_.CommunicationAndCoordinationController2LinkRepo)
    communicationAndCoordinationController2LinkRepo: _.CommunicationAndCoordinationController2LinkRepo,
    @inject(_.InternalAndExternalEconomicsControllerLinkRepo)
    internalAndExternalEconomicsControllerLinkRepo: _.InternalAndExternalEconomicsControllerLinkRepo,
    @inject(_.SafetyCultureControllerLinkRepo)
    safetyCultureControllerLinkRepo: _.SafetyCultureControllerLinkRepo,
    @inject(_.SafetyInformationSystemControllerLinkRepo)
    safetyInformationSystemControllerLinkRepo: _.SafetyInformationSystemControllerLinkRepo,
    @inject(_.SafetyManagementSystemControllerLinkRepo)
    safetyManagementSystemControllerLinkRepo: _.SafetyManagementSystemControllerLinkRepo,
    @inject(_.ControlActionRepo)
    controlActionRepo: _.ControlActionRepo,
    @inject(_.FeedbackRepo)
    feedbackRepo: _.FeedbackRepo,
    @inject(_.InputRepo)
    inputRepo: _.InputRepo,
    @inject(_.OutputRepo)
    outputRepo: _.OutputRepo,
    @inject(_.ActuatorRepo)
    actuatorRepo: _.ActuatorRepo,
    @inject(_.ControlledProcessRepo)
    controlledProcessRepo: _.ControlledProcessRepo,
    @inject(_.ControllerRepo)
    controllerRepo: _.ControllerRepo,
    @inject(_.SensorRepo)
    sensorRepo: _.SensorRepo,
    @inject(_.AccidentDescriptionRepo)
    accidentDescriptionRepo: _.AccidentDescriptionRepo,
    @inject(_.ArrowRepo)
    arrowRepo: _.ArrowRepo,
    @inject(_.BoxRepo)
    boxRepo: _.BoxRepo,
    @inject(_.ChangesAndDynamicsOverTimeRepo)
    changesAndDynamicsOverTimeRepo: _.ChangesAndDynamicsOverTimeRepo,
    @inject(_.CommunicationAndCoordinationRepo)
    communicationAndCoordinationRepo: _.CommunicationAndCoordinationRepo,
    @inject(_.ConstraintRepo)
    constraintRepo: _.ConstraintRepo,
    @inject(_.EventRepo)
    eventRepo: _.EventRepo,
    @inject(_.HazardRepo)
    hazardRepo: _.HazardRepo,
    @inject(_.InternalAndExternalEconomicsRepo)
    internalAndExternalEconomicsRepo: _.InternalAndExternalEconomicsRepo,
    @inject(_.OtherFactorsRepo)
    otherFactorsRepo: _.OtherFactorsRepo,
    @inject(_.ProcessVariableRepo)
    processVariableRepo: _.ProcessVariableRepo,
    @inject(_.ProjectRepo)
    projectRepo: _.ProjectRepo,
    @inject(_.QuestionAndAnswersRepo)
    questionAndAnswersRepo: _.QuestionAndAnswersRepo,
    @inject(_.RecommendationRepo)
    recommendationRepo: _.RecommendationRepo,
    @inject(_.ResponsibilityRepo)
    responsibilityRepo: _.ResponsibilityRepo,
    @inject(_.RoleInTheAccidentRepo)
    roleInTheAccidentRepo: _.RoleInTheAccidentRepo,
    @inject(_.SafetyCultureRepo)
    safetyCultureRepo: _.SafetyCultureRepo,
    @inject(_.SafetyInformationSystemRepo)
    safetyInformationSystemRepo: _.SafetyInformationSystemRepo,
    @inject(_.SafetyManagementSystemRepo)
    safetyManagementSystemRepo: _.SafetyManagementSystemRepo,
    @inject(_.SubRecommendationRepo)
    subRecommendationRepo: _.SubRecommendationRepo,
    @inject(_.SystemDescriptionRepo)
    systemDescriptionRepo: _.SystemDescriptionRepo,
    @inject(_.LastIdRepo)
    lastIdRepo: _.LastIdRepo,
    @inject(_.QuestionComponentLinkRepo)
    questionComponentLinkRepo: _.QuestionComponentLinkRepo,
    @inject(_.VectorGraphicRepo)
    vectorGraphicRepo: _.VectorGraphicRepo
  ) {
    this.changesAndDynamicsOverTimeDescriptionRepo = changesAndDynamicsOverTimeDescriptionRepo;
    this.communicationAndCoordinationDescriptionRepo = communicationAndCoordinationDescriptionRepo;
    this.internalAndExternalEconomicsDescriptionRepo = internalAndExternalEconomicsDescriptionRepo;
    this.safetyCultureDescriptionRepo = safetyCultureDescriptionRepo;
    this.safetyInformationSystemDescriptionRepo = safetyInformationSystemDescriptionRepo;
    this.safetyManagementSystemDescriptionRepo = safetyManagementSystemDescriptionRepo;
    this.constraintHazardLinkRepo = constraintHazardLinkRepo;
    this.constraintResponsibilityLinkRepo = constraintResponsibilityLinkRepo;
    this.controllerResponsibilityLinkRepo = controllerResponsibilityLinkRepo;
    this.changesAndDynamicsOverTimeControllerLinkRepo = changesAndDynamicsOverTimeLinkRepo;
    this.communicationAndCoordinationController1LinkRepo = communicationAndCoordinationController1LinkRepo;
    this.communicationAndCoordinationController2LinkRepo = communicationAndCoordinationController2LinkRepo;
    this.internalAndExternalEconomicsControllerLinkRepo = internalAndExternalEconomicsControllerLinkRepo;
    this.internalAndExternalEconomicsRepo = internalAndExternalEconomicsRepo;
    this.safetyCultureControllerLinkRepo = safetyCultureControllerLinkRepo;
    this.safetyInformationSystemControllerLinkRepo = safetyInformationSystemControllerLinkRepo;
    this.safetyManagementSystemControllerLinkRepo = safetyManagementSystemControllerLinkRepo;
    this.controlActionRepo = controlActionRepo;
    this.feedbackRepo = feedbackRepo;
    this.inputRepo = inputRepo;
    this.outputRepo = outputRepo;
    this.actuatorRepo = actuatorRepo;
    this.controlledProcessRepo = controlledProcessRepo;
    this.controllerRepo = controllerRepo;
    this.sensorRepo = sensorRepo;
    this.accidentDescriptionRepo = accidentDescriptionRepo;
    this.arrowRepo = arrowRepo;
    this.boxRepo = boxRepo;
    this.changesAndDynamicsOverTimeRepo = changesAndDynamicsOverTimeRepo;
    this.communicationAndCoordinationRepo = communicationAndCoordinationRepo;
    this.constraintRepo = constraintRepo;
    this.eventRepo = eventRepo;
    this.hazardRepo = hazardRepo;
    this.internalAndExternalEconomicsRepo = internalAndExternalEconomicsRepo;
    this.otherFactorsRepo = otherFactorsRepo;
    this.processVariableRepo = processVariableRepo;
    this.projectRepo = projectRepo;
    this.questionAndAnswersRepo = questionAndAnswersRepo;
    this.recommendationRepo = recommendationRepo;
    this.responsibilityRepo = responsibilityRepo;
    this.roleInTheAccidentRepo = roleInTheAccidentRepo;
    this.safetyCultureRepo = safetyCultureRepo;
    this.safetyInformationSystemRepo = safetyInformationSystemRepo;
    this.safetyManagementSystemRepo = safetyManagementSystemRepo;
    this.subRecommendationRepo = subRecommendationRepo;
    this.systemDescriptionRepo = systemDescriptionRepo;
    this.lastIdRepo = lastIdRepo;
    this.questionComponentLinkRepo = questionComponentLinkRepo;
    this.vectorGraphicRepo = vectorGraphicRepo;
  }
}
