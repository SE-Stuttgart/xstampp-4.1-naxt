import { Arrow } from '@src-shared/control-structure/models';
import { ControlAction } from '@src-shared/control-structure/models/information-flow/ControlAction';
import { Service } from '@src-shared/control-structure/services/common/Service';
import { updateArrowsWithNewName } from '@src-shared/control-structure/services/util/UpdateArrowsWithNewName';
import { NextId, UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class ControlActionService extends Service<ControlAction> {
  constructor(
    @unmanaged() projectRepo: Repository<Project> & UnchangedSavesSetter,
    @unmanaged() private readonly controlActionRepo: Repository<ControlAction>,
    @unmanaged() lastIdRepo: NextId<ControlAction>,
    @unmanaged() private readonly arrowRepo: Repository<Arrow>
  ) {
    super(ControlAction, projectRepo, controlActionRepo, lastIdRepo);
  }

  public async update(controlAction: ControlAction): Promise<ControlAction | null> {
    const oldControlAction = await this.controlActionRepo._find({
      ...new ControlAction(),
      projectId: controlAction.projectId,
      id: controlAction.id,
    });
    await updateArrowsWithNewName(oldControlAction, controlAction, this.arrowRepo);
    return super.update(controlAction);
  }
}
