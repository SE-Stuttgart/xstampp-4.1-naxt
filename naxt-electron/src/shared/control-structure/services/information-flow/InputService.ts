import { Arrow } from '@src-shared/control-structure/models';
import { Input } from '@src-shared/control-structure/models/information-flow/Input';
import { Service } from '@src-shared/control-structure/services/common/Service';
import { updateArrowsWithNewName } from '@src-shared/control-structure/services/util/UpdateArrowsWithNewName';
import { NextId, UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class InputService extends Service<Input> {
  constructor(
    @unmanaged() projectRepo: Repository<Project> & UnchangedSavesSetter,
    @unmanaged() private readonly inputRepo: Repository<Input>,
    @unmanaged() lastIdRepo: NextId<Input>,
    @unmanaged() private readonly arrowRepo: Repository<Arrow>
  ) {
    super(Input, projectRepo, inputRepo, lastIdRepo);
  }

  public async update(input: Input): Promise<Input | null> {
    const oldInput = await this.inputRepo._find({
      ...new Input(),
      projectId: input.projectId,
      id: input.id,
    });
    await updateArrowsWithNewName(oldInput, input, this.arrowRepo);
    return super.update(input);
  }
}
