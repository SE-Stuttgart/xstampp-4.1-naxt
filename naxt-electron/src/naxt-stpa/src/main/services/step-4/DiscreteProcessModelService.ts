import { inject, injectable } from 'inversify';
import { DiscreteProcessVariableValue } from '../../models';
import { DiscreteProcessVariableValueRepo, ProjectRepo } from '../../repositories';
import { ProjectIdService } from '../common/ProjectIdService';

@injectable()
export class DiscreteProcessVariableValueService extends ProjectIdService<DiscreteProcessVariableValue> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,

    @inject(DiscreteProcessVariableValueRepo)
    private readonly discreteProcessVariableValueRepo: DiscreteProcessVariableValueRepo
  ) {
    super(DiscreteProcessVariableValue, projectRepo, discreteProcessVariableValueRepo);
  }

  public async replaceAll(
    projectId: string,
    processVariableId: number,
    discreteValues: DiscreteProcessVariableValue[]
  ): Promise<{ success: DiscreteProcessVariableValue[]; error: any }> {
    await this.discreteProcessVariableValueRepo.removeAllForProcessVariableId(projectId, processVariableId);
    return this.discreteProcessVariableValueRepo.insertAll(discreteValues);
  }
}
