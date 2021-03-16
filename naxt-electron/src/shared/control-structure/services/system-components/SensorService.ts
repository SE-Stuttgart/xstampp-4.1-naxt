import { Box } from '@src-shared/control-structure/models';
import { Sensor } from '@src-shared/control-structure/models/system-components/Sensor';
import { Service } from '@src-shared/control-structure/services/common/Service';
import { updateBoxesWithNewName } from '@src-shared/control-structure/services/util/UpdateArrowsWithNewName';
import { NextId, UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class SensorService extends Service<Sensor> {
  constructor(
    @unmanaged() projectRepo: Repository<Project> & UnchangedSavesSetter,
    @unmanaged() controlActionRepo: Repository<Sensor>,
    @unmanaged() lastIdRepo: NextId<Sensor>,
    @unmanaged() private readonly boxRepo: Repository<Box>
  ) {
    super(Sensor, projectRepo, controlActionRepo, lastIdRepo);
  }

  public async update(obj: Sensor): Promise<Sensor | null> {
    await updateBoxesWithNewName(obj, this.boxRepo);
    return super.update(obj);
  }
}
