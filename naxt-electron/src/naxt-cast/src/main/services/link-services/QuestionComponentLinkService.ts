import {
  ChangesAndDynamicsOverTime,
  CommunicationAndCoordination,
  Constraint,
  Event,
  Hazard,
  InternalAndExternalEconomics,
  QuestionComponentLink,
  Responsibility,
  RoleInTheAccident,
  SafetyCulture,
  SafetyInformationSystem,
  SafetyManagementSystem,
} from '@cast/src/main/models';
import { ProjectRepo, QuestionAndAnswersRepo, QuestionComponentLinkRepo } from '@cast/src/main/repositories';
import { Chip } from '@cast/src/main/services';
import { AllReposService } from '@cast/src/main/services/helper-services/AllReposService';
import { ChipPrefix as Prefix } from '@cast/src/main/services/models';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import { toChips } from '@cast/src/main/services/util/toChips';
import {
  Actuator,
  ControlAction,
  ControlledProcess,
  Controller,
  Feedback,
  Input,
  Output,
  Sensor,
} from '@src-shared/control-structure/models';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { Id, IdString, Named } from '@src-shared/Interfaces';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject } from 'inversify';
import { LinkService } from '../common/LinkService';

export class QuestionComponentLinkService extends LinkService<QuestionComponentLink> {
  constructor(
    @inject(ProjectRepo) private readonly projectRepo: ProjectRepo,
    @inject(QuestionComponentLinkRepo) private readonly linkRepo: QuestionComponentLinkRepo,
    @inject(QuestionAndAnswersRepo) private readonly questionAndAnswersRepo: QuestionAndAnswersRepo,
    @inject(AllReposService) private readonly _: AllReposService
  ) {
    super(QuestionComponentLink, projectRepo, linkRepo);
  }

  public async create(link: QuestionComponentLink): Promise<QuestionComponentLink> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  private async checkCreationRules(link: QuestionComponentLink): Promise<void> {
    const { projectId, questionId } = link;

    const questionExists = this.questionAndAnswersRepo.exists(projectId, questionId);
    if (!questionExists) throw new NAXTError('No such [question and answer] exists:', link);
  }

  public async createComponentLink<T>(
    projectId: string,
    componentId: string | number,
    questionId: string,
    componentClazz: { new (): T }
  ): Promise<QuestionComponentLink> {
    return this.create({
      projectId: projectId,
      componentId: componentId.toString(),
      questionId: questionId,
      componentType: componentClazz.name,
    });
  }

  public async removeComponentLink<T>(
    projectId: string,
    componentId: string | number,
    questionId: string
  ): Promise<boolean> {
    return this.linkRepo.remove(projectId, componentId.toString(), questionId);
  }

  public async removeComponentLinkForComponent<T>(
    projectId: string,
    componentId: string | number,
    questionId: string,
    componentClazz: { new (): T }
  ): Promise<boolean> {
    return this.linkRepo.removeForComponent(projectId, componentId.toString(), questionId, componentClazz);
  }

  public async getComponentChips(projectId: string): Promise<ChipMap> {
    const questionsAndAnswers = await this.questionAndAnswersRepo.findAll(projectId);
    const allLinks = await this.linkRepo.findAll(projectId);

    const chipMap = new ChipMap();
    questionsAndAnswers.forEach(({ id }) => chipMap.set(id, new Array<Chip>()));

    const promises = [];
    questionsAndAnswers.forEach(questionAndAnswer => {
      const links = allLinks.filter(link => link.questionId === questionAndAnswer.id);

      function add<T extends (IdString | Id) & Named>(
        clazz: { new (): T },
        chipPrefix: Prefix,
        repo: Repository<T>
      ): void {
        promises.push(
          repo.findAll(projectId).then(components => {
            const linkIds = links
              .filter(link => link.componentType === clazz.name)
              .map(link => String(link.componentId));
            const chips = toChips(chipPrefix)(components, linkIds);
            chipMap.get(questionAndAnswer.id).push(...chips);
          })
        );
      }

      add(Hazard, Prefix.Hazard, this._.hazardRepo);
      add(Constraint, Prefix.Constraint, this._.constraintRepo);
      add(Event, Prefix.Event, this._.eventRepo);
      add(ControlAction, Prefix.ControlAction, this._.controlActionRepo);
      add(Feedback, Prefix.Feedback, this._.feedbackRepo);
      add(Input, Prefix.Input, this._.inputRepo);
      add(Output, Prefix.Output, this._.outputRepo);
      add(Actuator, Prefix.Actuator, this._.actuatorRepo);
      add(ControlledProcess, Prefix.ControlledProcess, this._.controlledProcessRepo);
      add(Controller, Prefix.Controller, this._.controllerRepo);
      add(Sensor, Prefix.Sensor, this._.sensorRepo);
      add(Responsibility, Prefix.Responsibility, this._.responsibilityRepo);
      add(RoleInTheAccident, Prefix.RoleInTheAccident, this._.roleInTheAccidentRepo);
      add(SafetyCulture, Prefix.SafetyCulture, this._.safetyCultureRepo);
      add(SafetyInformationSystem, Prefix.SafetyInformation, this._.safetyInformationSystemRepo);
      add(SafetyManagementSystem, Prefix.SafetyManagement, this._.safetyManagementSystemRepo);
      add(ChangesAndDynamicsOverTime, Prefix.ChangesAndDynamicsOverTime, this._.changesAndDynamicsOverTimeRepo);
      add(CommunicationAndCoordination, Prefix.CommunicationAndCoordination, this._.communicationAndCoordinationRepo);
      add(InternalAndExternalEconomics, Prefix.InternalAndExternalEconomics, this._.internalAndExternalEconomicsRepo);
    });

    await Promise.all(promises);
    return chipMap;
  }
}
