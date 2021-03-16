import { State } from '@src-shared/Enums';
import { Described, EntityDependent, Named, Stated } from '@src-shared/Interfaces';

export abstract class EntityDependentTableEntry implements EntityDependent {
  readonly id: number;
  readonly parentId: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  protected constructor(tableEntry: EntityDependent & Named & Described & Stated) {
    this.id = tableEntry.id;
    this.parentId = tableEntry.parentId;

    this.projectId = tableEntry.projectId;
    this.name = tableEntry.name;
    this.description = tableEntry.description;
    this.state = tableEntry.state;

    this.tableId = this.tableId = `${tableEntry.parentId}.${tableEntry.id}`;
  }
}
