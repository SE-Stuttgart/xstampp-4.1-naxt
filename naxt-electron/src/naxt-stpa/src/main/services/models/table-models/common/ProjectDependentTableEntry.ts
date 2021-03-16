import { State } from '@src-shared/Enums';
import { Described, Named, ProjectDependent, Stated, TableEntry } from '@src-shared/Interfaces';

export abstract class ProjectDependentTableEntry implements ProjectDependent, TableEntry {
  readonly id: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  protected constructor(tableEntry: ProjectDependent & Named & Described & Stated) {
    this.id = tableEntry.id;
    this.projectId = tableEntry.projectId;
    this.name = tableEntry.name;
    this.description = tableEntry.description;
    this.state = tableEntry.state;

    this.tableId = `${tableEntry.id}`;
  }
}
