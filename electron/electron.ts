import { app, BrowserWindow, powerSaveBlocker, globalShortcut } from 'electron'
import * as isDev from 'electron-is-dev';
import {MasterRouter} from './electroncore/api/MasterRouter';

let idPowerSaveBolcker: any;
let win: Electron.BrowserWindow | null;
let master: MasterRouter


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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    master = new MasterRouter(win)
    // master.registerSocket('http://localhost:4000')
    idPowerSaveBolcker = powerSaveBlocker.start('prevent-display-sleep');
    console.log(powerSaveBlocker.isStarted(idPowerSaveBolcker));
    globalShortcut.register('Control+Alt+V', () => {
        win.focus()
    })
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
    powerSaveBlocker.stop(idPowerSaveBolcker);
})

app.on('quit', () => {
    master.leave()
});
