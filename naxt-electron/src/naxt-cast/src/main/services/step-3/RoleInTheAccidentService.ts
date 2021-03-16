import { Service } from '@cast/src/main/services/common/Service';
import {
  InformationFlowTableModel,
  RoleInTheAccidentTableModel,
  SystemComponentTableModel,
} from '@cast/src/main/services/models';
import { InformationFlowService } from '@cast/src/main/services/step-2/control-structure-services/InformationFlowService';
import { SystemComponentService } from '@cast/src/main/services/step-2/control-structure-services/SystemComponentService';
import {
  toActuatorChips,
  toControlActionChips,
  toControlledProcessChips,
  toControllerChips,
  toFeedbackChips,
  toInputChips,
  toOutputChips,
  toSensorChips,
} from '@cast/src/main/services/util/toChips';
import { InformationFlowType, SystemComponentType } from '@src-shared/Enums';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleInTheAccident } from '../../models';
import { LastIdRepo, ProjectRepo, RoleInTheAccidentRepo } from '../../repositories';

@injectable()
export class RoleInTheAccidentService extends Service<RoleInTheAccident> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(RoleInTheAccidentRepo) private readonly roleInTheAccidentRepo: RoleInTheAccidentRepo,
    @inject(InformationFlowService) private readonly informationFlowService: InformationFlowService,
    @inject(SystemComponentService) private readonly systemComponentService: SystemComponentService
  ) {
    super(RoleInTheAccident, projectRepo, roleInTheAccidentRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<RoleInTheAccidentTableModel[]> {
    return combineLatest([
      this.roleInTheAccidentRepo.findAll$(projectId),
      this.informationFlowService.getAllTableModels$(projectId),
      this.systemComponentService.getAllTableModels$(projectId),
    ]).pipe(
      map(([roles, informationFlows, systemComponents]) => {
        return roles.map(role => {
          return toTableModel(role, informationFlows, systemComponents);
        });
      })
    );
  }
}

function toTableModel(
  role: RoleInTheAccident,
  informationFlows: InformationFlowTableModel[],
  systemComponents: SystemComponentTableModel[]
): RoleInTheAccidentTableModel {
  let parent;
  switch (role.componentType) {
    case InformationFlowType.ControlAction:
      const controlActions = informationFlows.filter(hasType(InformationFlowType.ControlAction));
      parent = controlActions.find(isLinkedTo(role));
      return new RoleInTheAccidentTableModel(role, parent, toControlActionChips(controlActions, [parent.id]));

    case InformationFlowType.Feedback:
      const feedback = informationFlows.filter(hasType(InformationFlowType.Feedback));
      parent = feedback.find(isLinkedTo(role));
      return new RoleInTheAccidentTableModel(role, parent, toFeedbackChips(feedback, [parent.id]));

    case InformationFlowType.Input:
      const inputs = informationFlows.filter(hasType(InformationFlowType.Input));
      parent = inputs.find(isLinkedTo(role));
      return new RoleInTheAccidentTableModel(role, parent, toInputChips(inputs, [parent.id]));

    case InformationFlowType.Output:
      const outputs = informationFlows.filter(hasType(InformationFlowType.Output));
      parent = outputs.find(isLinkedTo(role));
      return new RoleInTheAccidentTableModel(role, parent, toOutputChips(outputs, [parent.id]));

    case SystemComponentType.Actuator:
      const actuators = systemComponents.filter(hasType(SystemComponentType.Actuator));
      parent = actuators.find(isLinkedTo(role));
      return new RoleInTheAccidentTableModel(role, parent, toActuatorChips(actuators, [parent.id]));

    case SystemComponentType.ControlledProcess:
      const controlledProcesses = systemComponents.filter(hasType(SystemComponentType.ControlledProcess));
      parent = controlledProcesses.find(isLinkedTo(role));
      return new RoleInTheAccidentTableModel(role, parent, toControlledProcessChips(controlledProcesses, [parent.id]));

    case SystemComponentType.Controller:
      const controllers = systemComponents.filter(hasType(SystemComponentType.Controller));
      parent = controllers.find(isLinkedTo(role));
      return new RoleInTheAccidentTableModel(role, parent, toControllerChips(controllers, [parent.id]));

    case SystemComponentType.Sensor:
      const sensors = systemComponents.filter(hasType(SystemComponentType.Sensor));
      parent = sensors.find(isLinkedTo(role));
      return new RoleInTheAccidentTableModel(role, parent, toSensorChips(sensors, [parent.id]));
  }
}

function hasType(type: InformationFlowType | SystemComponentType) {
  return (tableModel: InformationFlowTableModel | SystemComponentTableModel) => tableModel.type === type;
}

function isLinkedTo(role: RoleInTheAccident) {
  return csComponent => csComponent.id === role.componentId;
}
