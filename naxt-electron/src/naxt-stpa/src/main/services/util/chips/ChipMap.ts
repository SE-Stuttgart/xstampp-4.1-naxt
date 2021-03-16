import { Chip } from '@stpa/src/main/services/models/table-models/Chip';

export class ChipMap {
  readonly map: Map<string, Chip[]>;

  constructor() {
    this.map = new Map<string, Chip[]>();
  }

  public set(combinedId: string, chipList: Chip[]): void {
    this.map.set(combinedId, chipList);
  }

  public get(id: number, parentId?: number): Chip[] {
    const combinedId = parentId ? `${parentId}.${id}` : id.toString();
    const chipList = this.map.get(combinedId);
    return chipList ? chipList : [];
  }
}
