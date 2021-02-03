import * as EventEmitter from 'events';
import {
  QuestionInterface,
  TestInterface,
  TestType,
  UserAnswer
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

  cleanTest():any{
    const clean : any = {
      id: this.ID,
      type: this.type,
      numberOfQuestions : this.numberOfQuestions,
      questions: this.questions
    }
    return clean
  }

  addAnswer(userAnswer:  UserAnswer, questionID: number) {
    const question = this.findQuestion(questionID);
    const update = question.UsersAnswers.find(a => a.username === userAnswer.username)
    if(update){
      update.answer = userAnswer.answer;
    }else{
      question.UsersAnswers.push(userAnswer);
    }
    this.emit('answerAdded', question);
  }

  removeAnswer(user: string, questionID: number) {
    const question = this.findQuestion(questionID);
    const indexToDelete: number = question.UsersAnswers.findIndex(
      (a) => a.username === user
    );
    question.UsersAnswers.splice(indexToDelete, 1);
    this.emit('answerDeleted', question);
  }

  private findQuestion(questionID: number) {
    return this.questions.find((q) => q.id === questionID);
  }
}
//TODO: Chceck type answer whit question type for backend safety