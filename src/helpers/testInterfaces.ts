export enum QuestionType {
  SINGLE_ANSWER = 'SINGLE_ANSWER',
  TRUE_FALSE = 'TRUE_FALSE',
  SURVEY = 'SURVEY',
  DESCRIPTIVE = 'DESCRIPTIVE',
  MULTI_ANSWER = 'MULTI_ANSWER',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

export enum TestType {
  MATH = 'MATH',
  HISTORY = 'HISTORY',
  LANGUAGE = 'LANGUAGE',
  UNKNOWN = 'UNKNOWN',
}

export enum Mode {
  SINGLE = "Single",
  MULTI = "Multi"
}

export interface AnswerInterface {
  description: string;
  id: number;
}

export interface QuestionInterface {
  id: number;
  type: QuestionType;
  isRequired: boolean;
  hasLatex: boolean;
  question: string;
  answers: Array<AnswerInterface>;
  UsersAnswers: Array<UserAnswer>
}

export interface TestInterface {
  id: string;
  numberOfQuestions: number;
  questions: Array<QuestionInterface>;
}

export interface UserAnswer {
  username: string,
  answer: Array<AnswerInterface | string>
}