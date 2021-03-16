import { Chip } from '@cast/src/main/services/models';

export class ChipMap {
  readonly map: Map<string, Chip[]>;
  constructor() {
    this.map = new Map<string, Chip[]>();
  }

  public set(id: string, chipList: Chip[]): void {
    this.map.set(id, chipList);
  }

  public get(id: string): Chip[] {
    const chipList = this.map.get(id);
    return chipList ? chipList : [];
  }
}
