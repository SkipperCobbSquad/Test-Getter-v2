import { platform } from 'os';
import * as puppeteer from 'puppeteer-core';
import * as EventEmitter from 'events';
import { JSDOM } from 'jsdom';
import {
  QuestionType,
  AnswerInterface,
  QuestionInterface,
  TestInterface,
  TestType,
} from '../helpers/testInteraces';
import { Test } from './Test';

class Getter extends EventEmitter {
  page: puppeteer.Page;
  testID: string;
  numberQuest: number;
  listOfQuestions: Array<QuestionInterface>;
  pathToChrome: string;

  private readonly os: string = platform();

  constructor() {
    super();
    this.page = null;
    this.testID = '';
    this.numberQuest = 0;
    this.listOfQuestions = [];
    if (this.os === 'win32') {
      this.pathToChrome =
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
    } else {
      this.pathToChrome = 'google-chrome';
    }
  }
  async getTest(url: string, type: TestType = TestType.UNKNOWN) {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: this.pathToChrome,
      //TODO: Use this on resolver
      // ignoreDefaultArgs: ["--disable-extensions","--enable-automation"],
      // defaultViewport: null
    });
    this.page = await browser.newPage();
    await this.page.goto(url);
    try {
      //Get testID
      this.testID = url.split('=')[1];
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
        const rawQuest: any = await new JSDOM(await rawElement);
        //Scrap
        const quest: QuestionInterface = this.scrap(
          Array.from(
            await rawQuest.window.document.querySelector('.question-container')
              .children
          )
        );
        this.listOfQuestions.push(quest);
        console.log(quest);
        await this.emit('status', `Getting ${i}/${this.numberQuest}`)
        if (quest.isRequired) {
          console.log('FUCK');
          //TODO: Requierer.ts <- to randomly resolve question
        }
        //Go to next question
        await this.page.click('.test_button_box .mdc-button');
      }
      //Create Main Object of test
      const mainTest: TestInterface = {
        id: this.testID,
        numberOfQuestions: this.numberQuest,
        questions: this.listOfQuestions,
      };
      //Send status of creation
      await this.emit('status', 'ready');
      //Send created Test
      await this.emit('ready', new Test(mainTest, type))
      //End getting
      await browser.close();
      await this.clean();
    } catch (error) {
      await browser.close();
      await this.clean();
      console.log(error);
    }
  }

  clean() {
    this.page = null;
    this.testID = '';
    this.numberQuest = 0;
    this.listOfQuestions = [];
  }

  private async login() {
    await this.emit('status', 'Login');
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
    await this.emit('status', 'Getting number of questions');
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
  private scrap(raw: Array<any>): QuestionInterface {
    const ID: number = +raw[0].value;
    const questType: QuestionType = raw[1].value;
    let required: boolean = false;
    if (raw[2].querySelector('.mandatory_question')) {
      required = true;
    }
    const rawQuest: Array<string> = [];
    raw[3].querySelectorAll('p').forEach((q: HTMLParagraphElement) => {
      rawQuest.push(q.textContent);
    });
    const mainQuest: string = rawQuest.join(' ');

    const mainAnswer: Array<AnswerInterface> = [];
    const rawTableAnswers: Array<any> = Array.from(
      raw[4].querySelectorAll('.answer_container')
    );

    if (
      questType === QuestionType.SINGLE_ANSWER ||
      questType === QuestionType.MULTI_ANSWER ||
      questType === QuestionType.TRUE_FALSE ||
      questType === QuestionType.SURVEY
    ) {
      rawTableAnswers.forEach((a: HTMLDivElement) => {
        const preRenderAnswer: Array<string> = [];
        const answerID: number = +a
          .querySelector('label')
          .getAttribute('for')
          .split('_')[1];
        a.querySelectorAll('p').forEach((p: HTMLParagraphElement) => {
          preRenderAnswer.push(p.textContent);
        });
        //TODO: LateX detector for math equations
        const answer: AnswerInterface = {
          id: answerID,
          description: preRenderAnswer.join(' '),
        };
        mainAnswer.push(answer);
      });
    }

    const cleanQuest: QuestionInterface = {
      id: ID,
      type: questType,
      isRequired: required,
      question: mainQuest,
      answers: mainAnswer,
      hasLatex: false,
      UsersAnswers: [],
    };
    return cleanQuest;
  }
}

export default Getter;
