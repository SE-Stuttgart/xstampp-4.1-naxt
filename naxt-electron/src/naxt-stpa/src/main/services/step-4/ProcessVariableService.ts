import { Arrow, Box, Controller } from '@src-shared/control-structure/models';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { ProcessModelProcessVariableLinkService } from '@stpa/src/main/services/link-services/ProcessModelProcessVariableLinkService';
import { ProcessVariableResponsibilityLinkService } from '@stpa/src/main/services/link-services/ProcessVariableResponsibilityLinkService';

import {
  Chip,
  ChipPrefix,
  compareIds,
  NestedModels,
  ProcessVariableTableEntry,
  RequiredModels,
} from '@stpa/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DiscreteProcessVariableValue,
  ProcessModel,
  ProcessModelProcessVariableLink,
  ProcessVariable,
} from '../../models';
import {
  ArrowRepo,
  BoxRepo,
  ControllerRepo,
  DiscreteProcessVariableValueRepo,
  ProcessModelRepo,
  ProcessVariableRepo,
  ProjectEntityLastIdRepo,
  ProjectRepo,
} from '../../repositories';
import { ProjectDependentService } from '../common/ProjectDependentService';

@injectable()
export class ProcessVariableService extends ProjectDependentService<ProcessVariable> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(ProjectEntityLastIdRepo) lastIdRepo: ProjectEntityLastIdRepo,
    @inject(DiscreteProcessVariableValueRepo)
    private readonly discreteProcessVariableValueRepo: DiscreteProcessVariableValueRepo,
    @inject(ProcessVariableRepo)
    private readonly processVariableRepo: ProcessVariableRepo,
    @inject(ProcessModelRepo)
    private readonly processModelRepo: ProcessModelRepo,
    @inject(ControllerRepo)
    private readonly controllerRepo: ControllerRepo,
    @inject(ArrowRepo)
    private readonly arrowRepo: ArrowRepo,
    @inject(BoxRepo)
    private readonly boxRepo: BoxRepo,
    @inject(ProcessModelProcessVariableLinkService)
    private readonly processModelLinkService: ProcessModelProcessVariableLinkService,
    @inject(ProcessVariableResponsibilityLinkService)
    private readonly responsibilityLinkService: ProcessVariableResponsibilityLinkService
  ) {
    super(ProcessVariable, projectRepo, processVariableRepo, lastIdRepo);
  }

  async create(processVariable: ProcessVariable): Promise<ProcessVariable> {
    const processModelExists = this.processModelRepo.exists(processVariable.projectId, processVariable.id);
    if (!processModelExists) throw new NAXTError('No such [process model] exists:', processVariable);
    return super.create(processVariable);
  }

  public getRequiredEntries$(projectId: string): Observable<RequiredModels> {
    return combineLatest([this.controllerRepo.findAll$(projectId), this.processModelRepo.findAll$(projectId)]).pipe(
      map(([controllers, processModels]) => {
        const requiredModels = new RequiredModels();
        controllers.forEach(controller => {
          const linkedProcessModels = processModels.filter(isLinkedTo(controller));

          requiredModels.nestedModels.push(
            new NestedModels(
              controller,
              ChipPrefix.Controller,
              Controller.name,
              linkedProcessModels.map(
                processModel => new NestedModels(processModel, ChipPrefix.ProcessModel, ProcessModel.name)
              )
            )
          );
        });

        requiredModels.nestedModels.sort(compareIds);
        return requiredModels;
      })
    );
  }

  public getAllTableEntries$(projectId: string): Observable<ProcessVariableTableEntry[]> {
    return combineLatest([
      combineLatest([
        this.processVariableRepo.findAll$(projectId),
        this.controllerRepo.findAll$(projectId),
        this.processModelRepo.findAll$(projectId),
      ]),
      this.processModelLinkService.getProcessModelChipMapByProcessVariableIds$(projectId),
      this.responsibilityLinkService.getResponsibilityChipMapByProcessVariableIds$(projectId),
      this.processModelLinkService.getAll$(projectId),
      this.discreteProcessVariableValueRepo.findAll$(projectId),
      combineLatest([this.arrowRepo.findAll$(projectId), this.boxRepo.findAll$(projectId)]),
    ]).pipe(
      map(
        ([
          [processVariables, controllers, processModels],
          processModelChipMap,
          responsibilityChipMap,
          processModelLinks,
          discreteProcessVariableValues,
          [arrows, boxes],
        ]) => {
          return processVariables.map(processVariable => {
            const processModelLink = processModelLinks.find(isLinkedToProcessVariable(processVariable));
            const processModel = processModels.find(hasEqualProcessModelId(processModelLink));
            const controller = controllers.find(isParentOf(processModel));

            // variable values
            const currentVariableValue = processModelLink ? processModelLink.processVariableValue : 'null';
            const possibleVariableValues = discreteProcessVariableValues
              .filter(isLinkedToProcessVariable(processVariable))
              .map(toVariableValue);

            // gather all inputs to controller box
            const controllerBox = boxes.find(isBoxOf(controller));

            const inputChips = arrows.filter(arrowDestinationMatches(controllerBox)).map(toInputChip(boxes));

            const selectedChip = inputChips.find(chipIdMatchesArrowIdOf(processVariable));
            if (selectedChip) selectedChip.selected = true;

            return new ProcessVariableTableEntry(
              processVariable,
              controller,
              currentVariableValue,
              possibleVariableValues,
              processModelChipMap.get(processVariable.id),
              responsibilityChipMap.get(processVariable.id),
              inputChips.map(hashChipLabel)
            );
          });
        }
      )
    );
  }
}

function isParentOf(processModel: ProcessModel) {
  return controller => controller.id === processModel?.controllerId;
}

function hasEqualProcessModelId(processModelLink: ProcessModelProcessVariableLink) {
  return processModel => processModel.controllerId === processModelLink?.processModelId;
}

function toVariableValue(value: DiscreteProcessVariableValue): string {
  return value.variableValue;
}

function isLinkedToProcessVariable(processVariable: ProcessVariable) {
  return link => link.processVariableId === processVariable.id;
}

function isLinkedTo(controller: Controller) {
  return processModel => processModel.controllerId === controller.id;
}

function chipIdMatchesArrowIdOf(processVariable: ProcessVariable) {
  return chip => chip.id === processVariable.arrowId;
}

function arrowDestinationMatches(controllerBox: Box) {
  return arrow => {
    if (!controllerBox) return false;
    return arrow.destination === controllerBox.id;
  };
}

function isBoxOf(linkedController: Controller) {
  return link => {
    if (!linkedController) return false;
    return link.id === linkedController.boxId;
  };
}

function toInputChip(boxes: Box[]) {
  return (arrow: Arrow) => {
    const sourceBox = boxes.find(box => box.id === arrow.source);
    const chip: Chip = { id: arrow.id, label: ChipPrefix.BoxInput, name: sourceBox.name, selected: false };
    return chip;
  };
}

/**
 * top secret :)
 */
function hashChipLabel(chip: Chip): Chip {
  return { ...chip, label: chip.label + hashString(String(chip.id)) };
}

function hashString(str: string): number {
  let hash = 0;
  if (str.length == 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  hash = (hash % 9) + 1;
  if (hash < 0) hash = hash + 9;
  return hash;
}
