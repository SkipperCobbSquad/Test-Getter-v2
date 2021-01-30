import * as EventEmitter from 'events';
import {
    AnswerInterface,
  QuestionInterface,
  TestInterface,
  TestType,
} from '../helpers/testInteraces';

export class Test extends EventEmitter {
  type: TestType;
  ID: string;
  numberOfQuestions: number;
  questions: Array<QuestionInterface>;

  constructor(test: TestInterface, type: TestType = TestType.UNKNOWN) {
    super();
    this.ID = test.id;
    this.type = type;
    this.numberOfQuestions = test.numberOfQuestions;
    this.questions = test.questions;
  }

  addAnswer(user: string, questionID: number, answer: (AnswerInterface | string)) {
    const question = this.findQuestion(questionID);
    question.UsersAnswers.push({ user, answer });
    this.emit('answerAdded', question);
  }

  removeAnswer(user: string, questionID: number) {
    const question = this.findQuestion(questionID);
    const indexToDelete: number = question.UsersAnswers.findIndex(
      (a) => a.user === user
    );
    question.UsersAnswers.splice(indexToDelete, 1);
    this.emit('answerDeleted', question);
  }

  private findQuestion(questionID: number) {
    return this.questions.find((q) => q.id === questionID);
  }
}
