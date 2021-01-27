import * as puppeteer from 'puppeteer-core';
import * as EventEmitter from 'events';
import { JSDOM } from 'jsdom'
import {
  QuestionType,
  AnswerInterface,
  QuestionInterface,
  TestInterface,
} from '../helpers/testInteraces';

class Getter extends EventEmitter {
  page: puppeteer.Page;
  numberQuest: number;
  listOfQuestions: Array<any>;

  constructor() {
    super();
    this.page = null;
    this.numberQuest = 0;
    this.listOfQuestions = [];
  }
  async getTest(url: string) {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: 'google-chrome',
    });
    this.page = await browser.newPage();
    await this.page.goto(url);
    try {
      //Login to test
      await this.login();
      //Wait for first form
      await this.page.waitForSelector('.question-container');
      //Get number all questions
      await this.getNumberQuest();
      for (let i = 1; i <= this.numberQuest; i++) {
        //Wait for question container
        await this.page.waitForSelector('.question-container');
        //Getting raw html
        const rawElement: string = await this.getMeAQuestion();
        //Convert to DOMObject
        const rawQuest: any = await new JSDOM(await rawElement)
        //Scrap
        const quest: QuestionInterface = this.scrap(Array.from(await rawQuest.window.document.querySelector('.question-container').children));
        console.log(quest)
        await this.page.click('.mdc-button');
      }
    } catch (error) { console.log(error); }
  }

  private async login() {
    await this.page.evaluate(() => {
      document.querySelectorAll('input').forEach((input) => {
        if (!(input.type === 'hidden')) {
          input.value = ' ᠌᠌ ᠌ ᠌ ';
        }
      });
    });
    await this.page.click('#start-form-submit');
  }
  private async getNumberQuest() {
    this.numberQuest += await this.page.evaluate(() => {
      return +document
        .querySelector('.question_header_content')
        .textContent.split('/')[1];
    });
  }
  private async getMeAQuestion() {
    return await this.page.evaluate(
      () => document.querySelector('.question-area').innerHTML
    );
  }
  private scrap(raw: any) {
    const ID: number = +raw[0].value;
    const questType: QuestionType = raw[1].value;
    const rawQuest: Array<string> = [];
    raw[3].querySelectorAll('p').forEach((q: HTMLParagraphElement) => {
      rawQuest.push(q.textContent);
    });
    const mainQuest: string = rawQuest.join(' ');

    const mainAnswer: Array<AnswerInterface> = [];
    const rawTableAnswers: any = Array.from(raw[4].querySelectorAll('.answer_container'));

    if (questType === QuestionType.SINGLE_ANSWER ||
      questType === QuestionType.MULTI_ANSWER ||
      questType === QuestionType.TRUE_FALSE ||
      questType === QuestionType.SURVEY) {
      rawTableAnswers.forEach((a: HTMLDivElement) => {
        const preRenderAnswer: Array<string> = [];
        const answerID: number = + a.querySelector('label').getAttribute('for').split('_')[1];
        a.querySelectorAll('p').forEach((p: HTMLParagraphElement) => {
          preRenderAnswer.push(p.textContent)
        })
        //TODO: Latex detector for math equations
        const answer: AnswerInterface = {
          id: answerID,
          description: preRenderAnswer.join(' '),
          hasLatex: false
        };
        mainAnswer.push(answer)
      });
    }

    let required: boolean = false;
    if (raw[2].querySelector('.mandatory_question')) {
      required = true;
    }

    const cleanQuest: QuestionInterface = {
      id: ID,
      type: questType,
      isRequired: required,
      question: mainQuest,
      answers: mainAnswer,
      hasLatex: false
    }
    return cleanQuest
  }
}

export default Getter;
