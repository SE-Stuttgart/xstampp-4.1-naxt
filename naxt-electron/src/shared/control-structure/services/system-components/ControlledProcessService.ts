import { Box } from '@src-shared/control-structure/models';
import { ControlledProcess } from '@src-shared/control-structure/models/system-components/ControlledProcess';
import { Service } from '@src-shared/control-structure/services/common/Service';
import { updateBoxesWithNewName } from '@src-shared/control-structure/services/util/UpdateArrowsWithNewName';
import { NextId, UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class ControlledProcessService extends Service<ControlledProcess> {
  constructor(
    @unmanaged() projectRepo: Repository<Project> & UnchangedSavesSetter,
    @unmanaged() controlActionRepo: Repository<ControlledProcess>,
    @unmanaged() lastIdRepo: NextId<ControlledProcess>,
    @unmanaged() private readonly boxRepo: Repository<Box>
  ) {
    super(ControlledProcess, projectRepo, controlActionRepo, lastIdRepo);
  }

  async update(obj: ControlledProcess): Promise<ControlledProcess | null> {
    await updateBoxesWithNewName(obj, this.boxRepo);
    return super.update(obj);
  }
}
