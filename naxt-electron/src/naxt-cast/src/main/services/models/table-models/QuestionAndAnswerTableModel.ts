import { State } from '@src-shared/Enums';
import { QuestionAndAnswer } from '../../../models';
import { Chip, ChipPrefix } from '../Chip';
import { TableModel } from './common/TableModel';

export class QuestionAndAnswerTableModel extends TableModel implements QuestionAndAnswer {
  name: string;
  description: string;
  state: State;

  componentChips: Chip[];

  constructor(questionAndAnswers: QuestionAndAnswer, componentChips: Chip[]) {
    super(ChipPrefix.QuestionAndAnswer, questionAndAnswers);

    this.name = questionAndAnswers.name;
    this.description = questionAndAnswers.description;
    this.state = questionAndAnswers.state;

    this.componentChips = componentChips;
  }
}
