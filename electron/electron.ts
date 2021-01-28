import { app, BrowserWindow, powerSaveBlocker, ipcMain } from 'electron'
import * as isDev from 'electron-is-dev';
import Getter from './electroncore/engine/Getter';

let idPowerSaveBolcker: any;
let win: Electron.BrowserWindow | null;

const Getterv1: Getter = new Getter()

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
    Getterv1.getTest('https://www.testportal.net/test.html?t=E6hjzPGAEjPb')
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
