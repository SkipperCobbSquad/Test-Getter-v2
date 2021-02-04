import { AnswerInterface, UserAnswer } from './testInterfaces';
export interface Multi {
  guestionId: number;
  answers: Array<AnswerInterface>;
  UserAnswers: Array<UserAnswer>;
}

export interface CollectingAnswers {
  answer: AnswerInterface;
  users: Array<String>;
}
