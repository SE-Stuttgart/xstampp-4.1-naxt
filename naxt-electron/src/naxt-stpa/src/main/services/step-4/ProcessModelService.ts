import { Controller } from '@src-shared/control-structure/models';
import { ProcessModel } from '@stpa/src/main/models';
import { ControllerRepo, ProcessModelRepo, ProjectEntityLastIdRepo, ProjectRepo } from '@stpa/src/main/repositories';
import { ProjectDependentService } from '@stpa/src/main/services/common/ProjectDependentService';
import { ChipPrefix, compareIds, ProcessModelTableEntry } from '@stpa/src/main/services/models';
import { toControllerChips } from '@stpa/src/main/services/util/chips/toChips';
import { toCombinedStringId } from '@stpa/src/main/services/util/chips/toCombinedIds';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class ProcessModelService extends ProjectDependentService<ProcessModel> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(ProcessModelRepo) private readonly processModelRepo: ProcessModelRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo
  ) {
    super(ProcessModel, projectRepo, processModelRepo, lastIdRepo);
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

  public getAllTableEntries$(projectId: string): Observable<ProcessModelTableEntry[]> {
    return combineLatest([this.processModelRepo.findAll$(projectId), this.controllerRepo.findAll$(projectId)]).pipe(
      map(([processModels, controllers]) => {
        return processModels.map(processModel => {
          const linkedController = controllers.find(controller => controller.id === processModel.controllerId);
          const linkedControllerIds = linkedController ? [toCombinedStringId(linkedController)] : [];
          return new ProcessModelTableEntry(processModel, toControllerChips(controllers, linkedControllerIds));
        });
      })
    );
  }
}
