import { ControlAction } from '@src-shared/control-structure/models';
import { State } from '@src-shared/Enums';
import { UnsafeControlAction, UnsafeControlActionLastId } from '@stpa/src/main/models';
import {
  ControlActionRepo,
  ProjectRepo,
  UnsafeControlActionLastIdRepo,
  UnsafeControlActionRepo,
} from '@stpa/src/main/repositories';
import { LossScenarioService } from '@stpa/src/main/services/step-4/LossScenarioService';
import { UnsafeControlActionHazardLinkService } from '@stpa/src/main/services/link-services/UnsafeControlActionHazardLinkService';
import { UnsafeControlActionSubHazardLinkService } from '@stpa/src/main/services/link-services/UnsafeControlActionSubHazardLinkService';
import { ChipPrefix, compareIds, UnsafeControlActionTableEntry } from '@stpa/src/main/services/models';
import { ControllerConstraintService } from '@stpa/src/main/services/step-3/ControllerConstraintService';
import { toControlActionChips } from '@stpa/src/main/services/util/chips/toChips';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityDependentService } from '../common/EntityDependentService';

@injectable()
export class UnsafeControlActionService extends EntityDependentService<
  UnsafeControlAction,
  ControlAction,
  UnsafeControlActionLastId
> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(UnsafeControlActionLastIdRepo) lastIdRepo: UnsafeControlActionLastIdRepo,

    @inject(UnsafeControlActionRepo)
    private readonly unsafeControlActionRepo: UnsafeControlActionRepo,
    @inject(ControlActionRepo)
    private readonly controlActionRepo: ControlActionRepo,
    @inject(UnsafeControlActionHazardLinkService)
    private readonly hazardLinkService: UnsafeControlActionHazardLinkService,
    @inject(UnsafeControlActionSubHazardLinkService)
    private readonly subHazardLinkService: UnsafeControlActionSubHazardLinkService,
    @inject(ControllerConstraintService)
    private readonly controllerConstraintService: ControllerConstraintService,
    @inject(LossScenarioService)
    private readonly lossScenarioService: LossScenarioService
  ) {
    super(UnsafeControlAction, projectRepo, controlActionRepo, unsafeControlActionRepo, lastIdRepo);
  }

  public async create(t: UnsafeControlAction): Promise<UnsafeControlAction> {
    const newUca = await super.create(t);
    const { projectId, parentId, id } = newUca;
    await this.controllerConstraintService.create({
      description: '',
      id: id,
      name: `controller constraint for ${ChipPrefix.UnsafeControlAction}${newUca.parentId}.${newUca.id}`,
      parentId: parentId,
      projectId: projectId,
      state: State.TODO,
    });
    return newUca;
  }

  public async remove(unsafeControlAction: UnsafeControlAction): Promise<boolean> {
    const isRemoved = super.remove(unsafeControlAction);
    if (isRemoved) {
      const { projectId, parentId, id } = unsafeControlAction;
      await this.controllerConstraintService.remove(unsafeControlAction);
      await this.lossScenarioService
        .getAll(projectId)
        .then(lossScenarios => lossScenarios.filter(isLinkedToUca(parentId, id)))
        .then(lossScenarios => lossScenarios.forEach(this.lossScenarioService.remove));
    }
    return isRemoved;
  }

  public getRequiredEntries$(projectId: string): Observable<ControlAction[]> {
    return this.controlActionRepo.findAll$(projectId).pipe(
      map(controlActions =>
        controlActions.sort(compareIds).map(controlAction => {
          return { ...controlAction, name: `${ChipPrefix.ControlAction}${controlAction.id} ${controlAction.name}` };
        })
      )
    );
  }

  public getAllTableEntries$(projectId: string): Observable<UnsafeControlActionTableEntry[]> {
    return combineLatest([
      this.unsafeControlActionRepo.findAll$(projectId),
      this.controlActionRepo.findAll$(projectId),
      this.hazardLinkService.getHazardsChipMapByUnsafeControlActionIds$(projectId),
      this.subHazardLinkService.getSubHazardsChipMapByUnsafeControlActionIds$(projectId),
    ]).pipe(
      map(([unsafeControlActions, controlActions, hazardChipMap, subHazardChipMap]) => {
        return unsafeControlActions.map(unsafeControlAction => {
          const parentControlAction = controlActions.find(isParentOf(unsafeControlAction));
          return new UnsafeControlActionTableEntry(
            unsafeControlAction,
            toControlActionChips(controlActions, [parentControlAction.id.toString()]),
            hazardChipMap.get(unsafeControlAction.id, unsafeControlAction.parentId),
            subHazardChipMap.get(unsafeControlAction.id, unsafeControlAction.parentId)
          );
        });
      })
    );
  }
}

function isLinkedToUca(parentId: number, id: number) {
  return lossScenario => lossScenario.controlActionId === parentId && lossScenario.ucaId === id;
}

function isParentOf(unsafeControlAction: UnsafeControlAction) {
  return controlAction => controlAction.id === unsafeControlAction.parentId;
}
