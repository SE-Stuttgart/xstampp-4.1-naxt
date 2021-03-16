import { Box } from '@src-shared/control-structure/models';
import { Actuator } from '@src-shared/control-structure/models/system-components/Actuator';
import { Service } from '@src-shared/control-structure/services/common/Service';
import { updateBoxesWithNewName } from '@src-shared/control-structure/services/util/UpdateArrowsWithNewName';
import { NextId, UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class ActuatorService extends Service<Actuator> {
  constructor(
    @unmanaged() projectRepo: Repository<Project> & UnchangedSavesSetter,
    @unmanaged() controlActionRepo: Repository<Actuator>,
    @unmanaged() lastIdRepo: NextId<Actuator>,
    @unmanaged() private readonly boxRepo: Repository<Box>
  ) {
    super(Actuator, projectRepo, controlActionRepo, lastIdRepo);
  }

  public async update(obj: Actuator): Promise<Actuator | null> {
    await updateBoxesWithNewName(obj, this.boxRepo);
    return super.update(obj);
  }
}
