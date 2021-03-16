import { Controller } from '@src-shared/control-structure/models';
import { ChipPrefix, compareIds, ControlAlgorithmTableEntry } from '@stpa/src/main/services/models';
import { toControlActionChips, toControllerChips } from '@stpa/src/main/services/util/chips/toChips';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rule, RuleLastId } from '../../models';
import { ControlActionRepo, ControllerRepo, ProjectRepo, RuleLastIdRepo, RuleRepo } from '../../repositories';
import { EntityDependentService } from '../common/EntityDependentService';

@injectable()
export class ControlAlgorithmService extends EntityDependentService<Rule, Controller, RuleLastId> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(RuleLastIdRepo) lastIdRepo: RuleLastIdRepo,

    @inject(RuleRepo) private readonly ruleRepo: RuleRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo,
    @inject(ControlActionRepo) private readonly controlActionRepo: ControlActionRepo
  ) {
    super(Rule, projectRepo, controllerRepo, ruleRepo, lastIdRepo);
  }

  public getRequiredEntries$(projectId: string): Observable<Controller[]> {
    return this.controllerRepo.findAll$(projectId).pipe(
      map(controllers =>
        controllers.sort(compareIds).map(controller => {
          return { ...controller, name: `${ChipPrefix.Controller}${controller.id} ${controller.name}` };
        })
      )
    );
  }

  public getAllTableEntries$(projectId: string): Observable<ControlAlgorithmTableEntry[]> {
    return combineLatest([
      this.ruleRepo.findAll$(projectId),
      this.controllerRepo.findAll$(projectId),
      this.controlActionRepo.findAll$(projectId),
    ]).pipe(
      map(([rules, controller, controlActions]) => {
        return rules.map(rule => {
          const linkedController = controller.find(controller => controller.id === rule.parentId);
          const linkedControlAction = controlActions.find(controlAction => controlAction.id === rule.controlActionId);
          const linkedControlActionsIds = linkedControlAction ? [linkedControlAction.id.toString()] : [];
          return new ControlAlgorithmTableEntry(
            rule,
            toControllerChips(controller, [linkedController.id.toString()]),
            toControlActionChips(controlActions, linkedControlActionsIds)
          );
        });
      })
    );
  }
}
