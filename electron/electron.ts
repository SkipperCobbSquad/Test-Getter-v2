import { app, BrowserWindow, powerSaveBlocker } from 'electron'
import * as isDev from 'electron-is-dev';
import Router from './electroncore/api/Router';

let idPowerSaveBolcker: any;
let win: Electron.BrowserWindow | null;


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
    const ApiRouter: Router = new Router(win)
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('quit', () => {
    powerSaveBlocker.stop(idPowerSaveBolcker);
});
