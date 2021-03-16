import { Duration, State } from '../../../../../../../shared/Enums';
import { Recommendation } from '../../../../models';
import { Chip, ChipPrefix } from '../../Chip';
import { TableModel } from '../common/TableModel';

export class RecommendationTableModel extends TableModel implements Recommendation {
  description: string;
  name: string;
  state: State;
  personInCharge: string;
  duration: Duration;

  linkedSubRecommendations: Chip[];

  constructor(recommendation: Recommendation, linkedSubRecommendations: Chip[]) {
    super(ChipPrefix.Recommendation, recommendation);

    this.description = recommendation.description;
    this.name = recommendation.name;
    this.state = recommendation.state;
    this.personInCharge = recommendation.personInCharge;
    this.duration = recommendation.duration;

    this.linkedSubRecommendations = linkedSubRecommendations;
  }
}
