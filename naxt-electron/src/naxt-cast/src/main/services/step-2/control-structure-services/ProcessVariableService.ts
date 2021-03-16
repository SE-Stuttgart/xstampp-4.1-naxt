import { ProcessVariable } from '@cast/src/main/models';
import { ControllerRepo, LastIdRepo, ProcessVariableRepo, ProjectRepo } from '@cast/src/main/repositories';
import { Service } from '@cast/src/main/services/common/Service';
import { inject } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ProcessVariableService extends Service<ProcessVariable> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(ProcessVariableRepo) private readonly processVariableRepo: ProcessVariableRepo,
    @inject(ControllerRepo) private readonly controllerRepo: ControllerRepo
  ) {
    super(ProcessVariable, projectRepo, processVariableRepo, lastIdRepo);
  }

  public getMapByControllerId$(projectId: string): Observable<Map<number, ProcessVariable[]>> {
    return combineLatest([this.processVariableRepo.findAll$(projectId), this.controllerRepo.findAll$(projectId)]).pipe(
      map(([processVariables, controllers]) => {
        const map = new Map<number, ProcessVariable[]>();
        controllers.forEach(controller => map.set(controller.id, new Array<ProcessVariable>()));
        processVariables.forEach(variable => map.get(variable.controllerId)?.push(variable));
        return map;
      })
    );
  }
}
