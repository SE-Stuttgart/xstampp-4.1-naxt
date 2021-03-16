import { Box } from '@src-shared/control-structure/models';
import { Controller } from '@src-shared/control-structure/models/system-components/Controller';
import { Service } from '@src-shared/control-structure/services/common/Service';
import { updateBoxesWithNewName } from '@src-shared/control-structure/services/util/UpdateArrowsWithNewName';
import { NextId, UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class ControllerService extends Service<Controller> {
  constructor(
    @unmanaged() projectRepo: Repository<Project> & UnchangedSavesSetter,
    @unmanaged() controlActionRepo: Repository<Controller>,
    @unmanaged() lastIdRepo: NextId<Controller>,
    @unmanaged() private readonly boxRepo: Repository<Box>
  ) {
    super(Controller, projectRepo, controlActionRepo, lastIdRepo);
  }

  public async update(obj: Controller): Promise<Controller | null> {
    await updateBoxesWithNewName(obj, this.boxRepo);
    return super.update(obj);
  }
}
