import { app, BrowserWindow, powerSaveBlocker, ipcMain } from 'electron'
import * as isDev from 'electron-is-dev';
import Router from './electroncore/api/Router';
import { MultiRouter } from './electroncore/api/MultiRouter';

let idPowerSaveBolcker: any;
let win: Electron.BrowserWindow | null;
let ApiRouter: any


function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
        // icon: path.join(__dirname, 'Logo.png')
    });
    win.menuBarVisible = false;
    if (isDev) {
        win.loadURL('http://localhost:3000');
    } else {
        win.loadFile('build/index.html');
    }

    win.on('ready-to-show', () => {
        win?.show();
    });
}

app.on('ready', () => {
    createWindow();
    idPowerSaveBolcker = powerSaveBlocker.start('prevent-display-sleep');
    console.log(powerSaveBlocker.isStarted(idPowerSaveBolcker));
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('quit', () => {
    powerSaveBlocker.stop(idPowerSaveBolcker);
});

ipcMain.handle('single', () => {
    ApiRouter = null;
    ApiRouter = new Router(win)
})

ipcMain.handle('multi', (e: any, url: string) => {
    ApiRouter = null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
        ApiRouter = new MultiRouter(win, url)
        ApiRouter.on('ready', () => {
            resolve(null)
        })
    })
})

ipcMain.handle('leave', (e: any) => {
    ApiRouter.leave()
    ApiRouter = null;
})
