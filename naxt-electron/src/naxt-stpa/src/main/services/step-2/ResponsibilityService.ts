import { Controller } from '@src-shared/control-structure/models';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { Responsibility } from '@stpa/src/main/models';
import {
  ControllerRepo,
  ProjectEntityLastIdRepo,
  ProjectRepo,
  ResponsibilityRepo,
  SystemConstraintRepo,
} from '@stpa/src/main/repositories';
import { ResponsibilitySystemConstraintLinkService } from '@stpa/src/main/services/link-services/ResponsibilitySystemConstraintLinkService';
import {
  ChipPrefix,
  compareIds,
  ResponsibilitySubSystemConstraintLinkService,
  ResponsibilityTableEntry,
} from '@stpa/src/main/services/models';
import { toControllerChips } from '@stpa/src/main/services/util/chips/toChips';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectDependentService } from '../common/ProjectDependentService';

@injectable()
export class ResponsibilityService extends ProjectDependentService<Responsibility> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(ResponsibilityRepo)
    private readonly responsibilityRepo: ResponsibilityRepo,
    @inject(ControllerRepo)
    private readonly controllerRepo: ControllerRepo,
    @inject(SystemConstraintRepo)
    private readonly systemConstraintRepo: SystemConstraintRepo,
    @inject(ResponsibilitySystemConstraintLinkService)
    private readonly systemConstraintLinkService: ResponsibilitySystemConstraintLinkService,
    @inject(ResponsibilitySubSystemConstraintLinkService)
    private readonly subSystemConstraintLinkService: ResponsibilitySubSystemConstraintLinkService
  ) {
    super(Responsibility, projectRepo, responsibilityRepo, lastIdRepo);
  }

  public async create(responsibility: Responsibility): Promise<Responsibility> {
    const controllerExists = await this.controllerExists(responsibility);
    if (!controllerExists) throw new NAXTError('No such controller exists:', responsibility);
    return super.create(responsibility);
  }

  private async controllerExists({ controllerProjectId, controllerId }: Responsibility): Promise<boolean> {
    return await this.controllerRepo.exists(controllerProjectId, controllerId);
  }

  public async remove(responsibility: Responsibility): Promise<boolean> {
    const isRemoved = super.remove(responsibility);

    if (isRemoved) {
      const { projectId, id } = responsibility;
      await this.systemConstraintLinkService.removeAllByResponsibilityId(projectId, id);
      await this.subSystemConstraintLinkService.removeAllByResponsibilityId(projectId, id);
    }

    return isRemoved;
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

  public getAllTableEntries$(projectId: string): Observable<ResponsibilityTableEntry[]> {
    return combineLatest([
      this.responsibilityRepo.findAll$(projectId),
      this.controllerRepo.findAll$(projectId),
      this.systemConstraintLinkService.getAllSystemConstraintsAsChipsMappedByResponsibilityIds$(projectId),
      this.subSystemConstraintLinkService.getAllSubSystemConstraintsAsChipsMappedByResponsibilityIds$(projectId),
    ]).pipe(
      map(([responsibilities, controllers, systemConstraintChipMap, subSystemConstraintChipMap]) => {
        return responsibilities.map(responsibility => {
          const linkedController = controllers.find(isLinkedTo(responsibility));
          return new ResponsibilityTableEntry(
            responsibility,
            toControllerChips(controllers, [linkedController.id.toString()]),
            systemConstraintChipMap.get(responsibility.id),
            subSystemConstraintChipMap.get(responsibility.id)
          );
        });
      })
    );
  }
}

function isLinkedTo(responsibility: Responsibility) {
  return controller => controller.id === responsibility.controllerId;
}
