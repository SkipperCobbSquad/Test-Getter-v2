import { ipcMain, BrowserWindow } from 'electron';
import Getter from '../engine/Getter';
import { Test } from '../engine/Test';
import { QuestionInterface } from '../helpers/testInteraces';

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
      this.mainTest = test;
      this.mainTest.on('answerAdded', (q: QuestionInterface) => {
        this.bWin.webContents.send('answerAdded', q)
      })
    })

    ipcMain.handle('test', async () => {
      return this.mainTest.cleanTest();
    })

  }
}
export default Router;
