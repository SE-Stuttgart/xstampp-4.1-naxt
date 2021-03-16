import { RoleInTheAccident } from '@cast/src/main/models';
import { ArrowRepo, InputRepo, LastIdRepo, ProjectRepo, RoleInTheAccidentRepo } from '@cast/src/main/repositories';
import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { Input } from '@src-shared/control-structure/models';
import { InputService as SharedInputService } from '@src-shared/control-structure/services/information-flow/InputService';
import { InformationFlowType } from '@src-shared/Enums';
import { inject, injectable } from 'inversify';
import { v4 as uuidV4 } from 'uuid';

@injectable()
export class InputService extends SharedInputService {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(InputRepo) controlActionRepo: InputRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(RoleInTheAccidentRepo) private readonly roleInTheAccidentRepo: RoleInTheAccidentRepo,
    @inject(ArrowRepo) arrowRepo: ArrowRepo
  ) {
    super(projectRepo, controlActionRepo, lastIdRepo, arrowRepo);
  }

  async create(input: Input): Promise<Input> {
    const _input = await super.create(input);
    await this.roleInTheAccidentRepo.insert({
      ...new RoleInTheAccident(),
      id: uuidV4(),
      projectId: _input.projectId,
      componentId: _input.id,
      componentType: InformationFlowType.Input,
      label: `${ChipPrefix.Input}${_input.id}`,
      name: `role in the accident for ${ChipPrefix.Input}${_input.id}`,
    });
    return _input;
  }

  public async remove(input: Input): Promise<boolean> {
    const { projectId, id } = input;
    await this.roleInTheAccidentRepo.removeByComponentId(projectId, id, InformationFlowType.Input);
    return super.remove(input);
  }
}
