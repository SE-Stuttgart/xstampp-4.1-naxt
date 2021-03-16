import {
  ChipPrefix,
  compareIds,
  compareParentIds,
  ImplementationConstraintTableEntry,
  NestedModels,
  RequiredModels,
} from '@stpa/src/main/services/models';
import { toControllerConstraintChips } from '@stpa/src/main/services/util/chips/toChips';
import { toCombinedStringId } from '@stpa/src/main/services/util/chips/toCombinedIds';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImplementationConstraint, LossScenario, UnsafeControlAction } from '../../models';
import {
  ControllerConstraintRepo,
  ImplementationConstraintRepo,
  LossScenarioRepo,
  ProjectEntityLastIdRepo,
  ProjectRepo,
  UnsafeControlActionRepo,
} from '../../repositories';
import { ProjectDependentService } from '../common/ProjectDependentService';

@injectable()
export class ImplementationConstraintService extends ProjectDependentService<ImplementationConstraint> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(LossScenarioRepo) private readonly lossScenarioRepo: LossScenarioRepo,
    @inject(ImplementationConstraintRepo) private readonly implementationConstraintRepo: ImplementationConstraintRepo,
    @inject(UnsafeControlActionRepo) private readonly unsafeControlActionRepo: UnsafeControlActionRepo,
    @inject(ControllerConstraintRepo) private readonly controllerConstraintRepo: ControllerConstraintRepo
  ) {
    super(ImplementationConstraint, projectRepo, implementationConstraintRepo, lastIdRepo);
  }

  public getRequiredEntries$(projectId: string): Observable<RequiredModels> {
    return combineLatest([
      this.unsafeControlActionRepo.findAll$(projectId),
      this.lossScenarioRepo.findAll$(projectId),
    ]).pipe(
      map(([unsafeControlActions, lossScenarios]) => {
        const requiredModels = new RequiredModels();

        unsafeControlActions.forEach(uca => {
          const linkedLossScenarios = lossScenarios.filter(isLinkedToUnsafeControlAction(uca));

          const nestedModels = new NestedModels(
            uca,
            ChipPrefix.UnsafeControlAction,
            UnsafeControlAction.name,
            linkedLossScenarios.map(
              lossScenario => new NestedModels(lossScenario, ChipPrefix.LossScenario, LossScenario.name)
            )
          );

          requiredModels.nestedModels.push(nestedModels);
        });

        requiredModels.nestedModels.sort(compareIds).sort(compareParentIds);
        return requiredModels;
      })
    );
  }

  public getAllTableEntries$(projectId: string): Observable<ImplementationConstraintTableEntry[]> {
    return combineLatest([
      this.implementationConstraintRepo.findAll$(projectId),
      this.lossScenarioRepo.findAll$(projectId),
      this.controllerConstraintRepo.findAll$(projectId),
    ]).pipe(
      map(([implConstraints, lossScenarios, controllerConstraints]) => {
        return implConstraints.map(implConstraint => {
          const lossScenario = lossScenarios.find(isLinkedToImplConstraint(implConstraint));
          const controllerConstraint = controllerConstraints.find(isLinkedToLossScenario(lossScenario));
          return new ImplementationConstraintTableEntry(
            implConstraint,
            controllerConstraint,
            toControllerConstraintChips(controllerConstraints, [toCombinedStringId(controllerConstraint)])
          );
        });
      })
    );
  }
}

function isLinkedToImplConstraint(implConstraint: ImplementationConstraint) {
  return lossScenario => lossScenario.id === implConstraint.lossScenarioId;
}

function isLinkedToLossScenario(lossScenario: LossScenario) {
  return controllerConstraint =>
    controllerConstraint.parentId === lossScenario.controlActionId && controllerConstraint.id === lossScenario.ucaId;
}

function isLinkedToUnsafeControlAction(uca: UnsafeControlAction) {
  return lossScenario => lossScenario.ucaId === uca.id && lossScenario.controlActionId === uca.parentId;
}
