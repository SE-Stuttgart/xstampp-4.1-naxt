import { QuestionComponentLink } from '@cast/src/main/models';
import { CastBaseQuery } from '@cast/src/main/repositories/CastBaseQuery';
import { CastDBConnector } from '@cast/src/main/repositories/CastDbConnector';
import { DBConnector } from '@database-access/index';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, injectable } from 'inversify';

@injectable()
export class QuestionComponentLinkRepo extends Repository<QuestionComponentLink> {
  constructor(@inject(CastDBConnector) dbConnector: DBConnector) {
    super(QuestionComponentLink, CastBaseQuery.questionComponentLink, dbConnector);
  }

  public async remove<T>(projectId: string, componentId: string, questionId: string): Promise<boolean> {
    const collection = await this.getCollection();
    await collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('componentId')
      .eq(componentId)
      .where('questionId')
      .eq(questionId)
      .remove();
    return true;
  }

  public async removeForComponent<T>(
    projectId: string,
    componentId: string,
    questionId: string,
    clazz: { new (): T }
  ): Promise<boolean> {
    const collection = await this.getCollection();
    await collection
      .find()
      .where('projectId')
      .eq(projectId)
      .where('componentId')
      .eq(componentId)
      .where('questionId')
      .eq(questionId)
      .where('componentType')
      .eq(clazz.name)
      .remove();
    return true;
  }
}
