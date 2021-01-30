import { ipcMain, BrowserWindow } from 'electron';
import Getter from '../engine/Getter';
import { Test } from '../engine/Test';
import { TestInterface } from '../helpers/testInteraces';

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

    this.getterEngine.on('status', (status: string, test: TestInterface) => {
      this.bWin.webContents.send('getter-status', status);
    });

    this.getterEngine.on('ready', (test: Test)=>{
        
    })
  }
}
export default Router;
