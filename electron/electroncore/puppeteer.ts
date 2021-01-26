import * as puppeteer from 'puppeteer-core'
import * as EventEmitter from 'events';
class Getter extends EventEmitter {
  page: puppeteer.Page
  numberQuest: number
  listOfQuestions: Array<any>

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
      for (let i = 0; i <= this.numberQuest; i++) {
        //Wait for question container
        await this.page.waitForSelector('.question-container');
        console.log('here');
      }
    } catch (error) { }
  }

  async login() {
    await this.page.evaluate(() => {
      document.querySelectorAll('input').forEach((input) => {
        if (!(input.type === 'hidden')) {
          input.value = ' ᠌᠌ ᠌ ᠌ ';
        }
      });
    });
    await this.page.click('#start-form-submit');
  }
  async getNumberQuest() {
    this.numberQuest += await this.page.evaluate(() => {
      return +document
        .querySelector('.question_header_content')
        .textContent.split('/')[1];
    });
  }
}

export default Getter;
