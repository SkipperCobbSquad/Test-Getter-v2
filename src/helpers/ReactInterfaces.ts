import { AnswerInterface, UserAnswer } from './testInterfaces';
export interface SingleMulti {
  guestionId: number;
  answers: Array<AnswerInterface>;
  UserAnswers: Array<UserAnswer>;
  latex: boolean;
}

export interface CollectingAnswers {
  answer: AnswerInterface;
  users: Array<String>;
}
