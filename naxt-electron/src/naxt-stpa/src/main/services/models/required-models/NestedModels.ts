import { Id, Named, ParentId } from '@src-shared/Interfaces';
import { ChipPrefix } from '@stpa/src/main/services/models/table-models/Chip';

export class RequiredModels {
  readonly nestedModels: NestedModels[] = [];
}

export class NestedModels implements Id, ParentId, Named {
  readonly id: number;
  readonly parentId: number;

  readonly name: string;

  readonly modelLabel: string;
  readonly nestedModels: NestedModels[];

  constructor(
    model: (Id & Named) | (Id & ParentId & Named),
    chipPrefix: ChipPrefix,
    modelLabel: string,
    nestedModels?: NestedModels[]
  ) {
    this.id = model.id;
    this.parentId = (model as ParentId).parentId;
    if (chipPrefix === ChipPrefix.None) this.name = model.name;
    else if ((model as ParentId).parentId)
      this.name = `${chipPrefix}${(model as ParentId).parentId}.${model.id} ${model.name}`;
    else this.name = `${chipPrefix}${model.id} ${model.name}`;

    this.modelLabel = modelLabel;
    this.nestedModels = nestedModels ? nestedModels.sort(compareIds).sort(compareParentIds) : new Array<NestedModels>();
  }
}

export function compareIds(m1: Id, m2: Id): number {
  if (m1.id < m2.id) return -1;
  if (m1.id > m2.id) return 1;
  return 0;
}

export function compareParentIds(m1: ParentId, m2: ParentId): number {
  if (m1.parentId < m2.parentId) return -1;
  if (m1.parentId > m2.parentId) return 1;
  return 0;
}
