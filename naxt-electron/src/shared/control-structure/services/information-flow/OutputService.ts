import { Arrow } from '@src-shared/control-structure/models';
import { Output } from '@src-shared/control-structure/models/information-flow/Output';
import { Service } from '@src-shared/control-structure/services/common/Service';
import { updateArrowsWithNewName } from '@src-shared/control-structure/services/util/UpdateArrowsWithNewName';
import { NextId, UnchangedSavesSetter } from '@src-shared/Interfaces';
import { Project } from '@src-shared/project/Project';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class OutputService extends Service<Output> {
  constructor(
    @unmanaged() projectRepo: Repository<Project> & UnchangedSavesSetter,
    @unmanaged() private readonly outputRepo: Repository<Output>,
    @unmanaged() lastIdRepo: NextId<Output>,
    @unmanaged() private readonly arrowRepo: Repository<Arrow>
  ) {
    super(Output, projectRepo, outputRepo, lastIdRepo);
  }

  public async update(output: Output): Promise<Output | null> {
    const oldOutput = await this.outputRepo._find({
      ...new Output(),
      projectId: output.projectId,
      id: output.id,
    });
    await updateArrowsWithNewName(oldOutput, output, this.arrowRepo);
    return super.update(output);
  }
}
