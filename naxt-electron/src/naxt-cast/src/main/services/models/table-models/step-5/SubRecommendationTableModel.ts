import { Chip, ChipPrefix } from '../../Chip';
import { Duration, State } from '@src-shared/Enums';
import { Recommendation, SubRecommendation } from '../../../../models';
import { TableModel } from '../common/TableModel';

export class SubRecommendationTableModel extends TableModel implements SubRecommendation {
  parentId: string;

  name: string;
  description: string;
  state: State;

  personInCharge: string;
  duration: Duration;

  parentRecommendation: Recommendation;
  recommendationChips: Chip[];

  constructor(subRecommendation: SubRecommendation, parentRecommendation: Recommendation, recommendationChips: Chip[]) {
    super(ChipPrefix.SubRecommendation, subRecommendation);

    this.tableId = `${ChipPrefix.SubRecommendation}${subRecommendation.label}`;

    this.parentId = subRecommendation.parentId;

    this.name = subRecommendation.name;
    this.description = subRecommendation.description;
    this.state = subRecommendation.state;

    this.personInCharge = subRecommendation.personInCharge;
    this.duration = subRecommendation.duration;

    this.parentRecommendation = parentRecommendation;
    this.recommendationChips = recommendationChips;
  }
}
