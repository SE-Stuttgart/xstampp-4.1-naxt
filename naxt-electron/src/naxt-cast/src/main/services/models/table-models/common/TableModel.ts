import { ChipPrefix } from '@cast/src/main/services';
import { IdString, Label, ProjectId, TableId } from '@src-shared/Interfaces';

export abstract class TableModel implements ProjectId, IdString, Label, TableId {
  id: string;
  projectId: string;
  tableId: string;
  label: string;

  protected constructor(prefix: ChipPrefix, model: ProjectId & IdString & Label) {
    this.id = model.id;
    this.projectId = model.projectId;
    this.label = model.label;
    this.tableId = `${prefix}${model.label}`;
  }
}
