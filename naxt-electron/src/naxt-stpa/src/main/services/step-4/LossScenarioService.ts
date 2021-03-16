import { Box, ControlAction } from '@src-shared/control-structure/models';
import {
  ChipPrefix,
  compareIds,
  LossScenarioTableEntry,
  NestedModels,
  RequiredModels,
} from '@stpa/src/main/services/models';
import { ImplementationConstraintService } from '@stpa/src/main/services/step-4/ImplementationConstraintService';
import { toControlActionChips, toUnsafeControlActionChips } from '@stpa/src/main/services/util/chips/toChips';
import { combineIds } from '@stpa/src/main/services/util/chips/toCombinedIds';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LossScenario, UnsafeControlAction } from '../../models';
import {
  BoxRepo,
  ControlActionRepo,
  ControllerRepo,
  FeedbackRepo,
  InputRepo,
  LossScenarioRepo,
  ProjectEntityLastIdRepo,
  ProjectRepo,
  SensorRepo,
  UnsafeControlActionRepo,
} from '../../repositories';
import { ProjectDependentService } from '../common/ProjectDependentService';

@injectable()
export class LossScenarioService extends ProjectDependentService<LossScenario> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(LossScenarioRepo) private readonly lossScenarioRepo: LossScenarioRepo,
    @inject(ControlActionRepo) private readonly controlActionRepo: ControlActionRepo,
    @inject(UnsafeControlActionRepo) private readonly unsafeControlActionRepo: UnsafeControlActionRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo,
    @inject(FeedbackRepo) private readonly feedbackRepo: FeedbackRepo,
    @inject(InputRepo) private readonly inputRepo: InputRepo,
    @inject(SensorRepo) private readonly sensorRepo: SensorRepo,
    @inject(BoxRepo) private readonly boxRepo: BoxRepo,
    @inject(ImplementationConstraintService)
    private readonly implementationConstraintService: ImplementationConstraintService
  ) {
    super(LossScenario, projectRepo, lossScenarioRepo, lastIdRepo);
  }

  public async remove(lossScenario: LossScenario): Promise<boolean> {
    const isRemoved = super.remove(lossScenario);

    if (isRemoved) {
      const { projectId, id } = lossScenario;
      this.implementationConstraintService
        .getAll(projectId)
        .then(implConstraints => implConstraints.filter(isLinkedToLossScenario(id)))
        .then(implConstraints => implConstraints.forEach(this.implementationConstraintService.remove));
    }

    return isRemoved;
  }

  public getRequiredEntries$(projectId: string): Observable<RequiredModels> {
    return combineLatest([
      this.controlActionRepo.findAll$(projectId),
      this.unsafeControlActionRepo.findAll$(projectId),
    ]).pipe(
      map(([controlActions, unsafeControlActions]) => {
        const requiredModels = new RequiredModels();

        controlActions.forEach(controlAction => {
          const linkedUnsafeControlActions = unsafeControlActions.filter(isChildOf(controlAction));

          const nestedModels = new NestedModels(
            controlAction,
            ChipPrefix.ControlAction,
            ControlAction.name,
            linkedUnsafeControlActions.map(
              uca => new NestedModels(uca, ChipPrefix.UnsafeControlAction, UnsafeControlAction.name)
            )
          );
          requiredModels.nestedModels.push(nestedModels);
        });

        requiredModels.nestedModels.sort(compareIds);
        return requiredModels;
      })
    );
  }

  public getAllTableEntries$(projectId: string): Observable<LossScenarioTableEntry[]> {
    return combineLatest([
      this.lossScenarioRepo.findAll$(projectId),
      this.controlActionRepo.findAll$(projectId),
      this.unsafeControlActionRepo.findAll$(projectId),
      combineLatest([
        this.controllerRepo.findAll$(projectId),
        this.feedbackRepo.findAll$(projectId),
        this.inputRepo.findAll$(projectId),
        this.sensorRepo.findAll$(projectId),
        this.boxRepo.findAll$(projectId),
      ]),
    ]).pipe(
      map(([lossScenarios, controlActions, unsafeControlActions, [controllers, feedback, inputs, sensors, boxes]]) => {
        return lossScenarios.map(lossScenario => {
          const controlAction = controlActions.find(isLinkedControlAction(lossScenario));
          const unsafeControlAction = unsafeControlActions.find(isLinkedUnsafeControlAction(lossScenario));
          return new LossScenarioTableEntry(
            lossScenario,
            controlAction,
            unsafeControlAction,
            controllers,
            feedback,
            inputs,
            sensors,
            boxes.filter(isInputBox),
            toControlActionChips(controlActions, [lossScenario.controlActionId.toString()]),
            toUnsafeControlActionChips(unsafeControlActions, [
              combineIds(lossScenario.controlActionId, lossScenario.ucaId),
            ])
          );
        });
      })
    );
  }
}

function isLinkedToLossScenario(id: number) {
  return implementationConstraint => implementationConstraint.lossScenarioId === id;
}

function isInputBox(box: Box): boolean {
  return box.boxType === 'InputBox';
}

function isLinkedControlAction(lossScenario: LossScenario) {
  return controlAction => controlAction.id === lossScenario.controlActionId;
}

function isLinkedUnsafeControlAction(lossScenario: LossScenario) {
  return unsafeControlAction =>
    unsafeControlAction.id === lossScenario.ucaId && unsafeControlAction.parentId === lossScenario.controlActionId;
}

function isChildOf(controlAction: ControlAction) {
  return uca => uca.parentId === controlAction.id;
}
