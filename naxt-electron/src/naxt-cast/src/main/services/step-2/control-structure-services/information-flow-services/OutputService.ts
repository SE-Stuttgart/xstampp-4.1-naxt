import { RoleInTheAccident } from '@cast/src/main/models';
import { ArrowRepo, LastIdRepo, OutputRepo, ProjectRepo, RoleInTheAccidentRepo } from '@cast/src/main/repositories';
import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { Output } from '@src-shared/control-structure/models';
import { OutputService as SharedInputService } from '@src-shared/control-structure/services/information-flow/OutputService';
import { InformationFlowType } from '@src-shared/Enums';
import { inject, injectable } from 'inversify';
import { v4 as uuidV4 } from 'uuid';

@injectable()
export class OutputService extends SharedInputService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(OutputRepo) controlActionRepo: OutputRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(RoleInTheAccidentRepo) private readonly roleInTheAccidentRepo: RoleInTheAccidentRepo,
    @inject(ArrowRepo) arrowRepo: ArrowRepo
  ) {
    super(projectRepo, controlActionRepo, lastIdRepo, arrowRepo);
  }

  async create(output: Output): Promise<Output> {
    const _output = await super.create(output);
    await this.roleInTheAccidentRepo.insert({
      ...new RoleInTheAccident(),
      id: uuidV4(),
      projectId: _output.projectId,
      componentId: _output.id,
      componentType: InformationFlowType.Output,
      label: `${ChipPrefix.Output}${_output.id}`,
      name: `role in the accident for ${ChipPrefix.Output}${_output.id}`,
    });
    return _output;
  }

  public async remove(output: Output): Promise<boolean> {
    const { projectId, id } = output;
    await this.roleInTheAccidentRepo.removeByComponentId(projectId, id, InformationFlowType.Output);
    return super.remove(output);
  }
}
