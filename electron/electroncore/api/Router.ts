import { ipcMain, BrowserWindow } from 'electron';
import Getter from '../engine/Getter';
import { Test } from '../engine/Test';
import { QuestionInterface, UserAnswer } from '../helpers/testInteraces';

class Router {
  getterEngine: Getter;
  bWin: BrowserWindow;
  mainTest: Test;

  constructor(window: BrowserWindow) {
    this.getterEngine = new Getter();
    this.bWin = window;

    ipcMain.handle('get-test', async (e: any, url: string) => {
      this.getterEngine.getTest(url);
    });

    this.getterEngine.on('status', (status: string) => {
      this.bWin.webContents.send('getter-status', status);
    });

    this.getterEngine.on('ready', (test: Test) => {
      //Clean Up fucking shit
      ipcMain.removeHandler('answerAdded')
      ipcMain.removeAllListeners();
      this.mainTest = test;
      ipcMain.handle('answerAdded', (e :any ,answer: UserAnswer, questID: number)=>{
        this.mainTest.addAnswer(answer, questID)
        console.log('Here1');
      })
      this.mainTest.on('answerAdded', (q: QuestionInterface) => {
        this.bWin.webContents.send('answerAdded', q)
        console.log('Here2');
      })
    })

    ipcMain.handle('test', async () => {
      return this.mainTest.cleanTest();
    })

  }
}
export default Router;
