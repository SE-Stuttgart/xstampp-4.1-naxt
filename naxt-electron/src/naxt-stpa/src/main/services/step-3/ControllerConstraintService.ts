import { NAXTError } from '@src-shared/errors/NaxtError';
import { ControllerConstraint } from '@stpa/src/main/models';
import {
  ControlActionRepo,
  ControllerConstraintRepo,
  ProjectRepo,
  UnsafeControlActionRepo,
} from '@stpa/src/main/repositories';
import { EntityDependentService } from '@stpa/src/main/services/common/EntityDependentService';
import { ControllerConstraintTableEntry } from '@stpa/src/main/services/models';
import { toUnsafeControlActionChips } from '@stpa/src/main/services/util/chips/toChips';
import { toCombinedStringId } from '@stpa/src/main/services/util/chips/toCombinedIds';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class ControllerConstraintService extends EntityDependentService<ControllerConstraint, null, null> {
  constructor(
    @inject(ProjectRepo)
    private readonly projectRepo: ProjectRepo,
    @inject(ControllerConstraintRepo)
    private readonly controllerConstraintRepo: ControllerConstraintRepo,
    @inject(ControlActionRepo)
    private readonly controlActionRepo: ControlActionRepo,
    @inject(UnsafeControlActionRepo)
    private readonly unsafeControlActionRepo: UnsafeControlActionRepo
  ) {
    super(ControllerConstraint, projectRepo, null, controllerConstraintRepo, null);
  }

  public async create(controllerConstraint: ControllerConstraint): Promise<ControllerConstraint> {
    await this.projectRepo.setUnsavedChanges(controllerConstraint.projectId, true);
    return this._checkCreationRules(controllerConstraint).then(() =>
      this.controllerConstraintRepo.insert({ ...controllerConstraint })
    );
  }

  private async _checkCreationRules(controllerConstraint: ControllerConstraint): Promise<void> {
    const { projectId, parentId, id } = controllerConstraint;

    const projectExists = await this.projectRepo.exists(projectId);
    if (!projectExists) throw new NAXTError('No such project exists:', controllerConstraint);

    const parentExists = await this.unsafeControlActionRepo.exists(projectId, parentId, id);
    if (!parentExists) throw new NAXTError('No such parent exists:', controllerConstraint);
  }

  public getAllTableEntries$(projectId: string): Observable<ControllerConstraintTableEntry[]> {
    return combineLatest([
      this.controllerConstraintRepo.findAll$(projectId),
      this.unsafeControlActionRepo.findAll$(projectId),
    ]).pipe(
      map(([controllerConstraints, unsafeControlActions]) => {
        return controllerConstraints.map(controllerConstraint => {
          const linkedUnsafeControlAction = unsafeControlActions.find(isLinkedTo(controllerConstraint));
          return new ControllerConstraintTableEntry(
            controllerConstraint,
            linkedUnsafeControlAction,
            toUnsafeControlActionChips(unsafeControlActions, [toCombinedStringId(linkedUnsafeControlAction)])
          );
        });
      })
    );
  }
}

function isLinkedTo(controllerConstraint: ControllerConstraint) {
  return uca => uca.id === controllerConstraint.id && uca.parentId === controllerConstraint.parentId;
}
