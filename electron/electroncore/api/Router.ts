import { ipcMain, BrowserWindow } from 'electron';
import Getter from '../engine/Getter';
import { TestInterface } from '../helpers/testInteraces';

class Router {
    getterEngine: Getter;
    bWin: BrowserWindow;

    constructor(window: BrowserWindow) {
        this.getterEngine = new Getter()
        this.bWin = window;

        ipcMain.handle('get-test', async (e: any, url: string) => {
            this.getterEngine.getTest(url)
        })

        this.getterEngine.on('status', (status: string, test: TestInterface) => {
            if (test) {
                this.bWin.webContents.send('getter-status', status, test)
                console.log(test);
            } else {
                this.bWin.webContents.send('getter-status', status)
            }
        })
    }
}
export default Router