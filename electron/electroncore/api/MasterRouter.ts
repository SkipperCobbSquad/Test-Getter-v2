import { BrowserWindow, IpcMain, ipcMain } from "electron";
import { io, Socket } from "socket.io-client";

import { Test } from "../engine/Test";
import Getter from "../engine/Getter";

import { UserAnswer } from "../helpers/testInteraces";
import { Call, Mode, ServerCallbacks } from '../helpers/routerInterfaces';

export class MasterRouter {
    getterEngine: Getter;
    bWin: BrowserWindow;
    ipc: IpcMain
    mainTest: Test;
    socket: Socket;
    username: string;
    testName: string;
    operatingMode: Mode;
    socketRegistered: boolean;

    constructor(window: BrowserWindow) {
        this.ipc = ipcMain;
        this.bWin = window;
        this.socketRegistered = false;
        this.getterEngine = new Getter()

        this.ipc.handle('connectSocket', (e: any, URL: string) => {
            this.registerSocket(URL)
        })

        this.ipc.handle('setUsername', async (e: any, uName: string) => {
            console.log(uName);
            return new Promise((resolve, reject) => {
                if (this.socketRegistered) {
                    this.socket.emit('setUsername', uName, async (status: Call) => {
                        if (status.status === ServerCallbacks.OK) {
                            this.username = uName;
                            resolve(ServerCallbacks.OK)
                        } else {
                            reject(status.reason)
                        }
                    })
                } else {
                    reject('Socket is not registered')
                }
            })
        })

        this.getterEngine.on('status', (status: string) => {
            this.bWin.webContents.send('getter-status', status);
        });

    }


    registerSocket(URL: string) { //finaly some good fu*** food
        if (this.socket) {
            this.socket.offAny()
            delete this.socket;
        }
        const o: any = { reconnection: false }
        this.socket = io(URL, o);

        this.socket.on('connect', () => {
            this.socketRegistered = true;
            this.bWin.webContents.send('socketStatus', { status: 'Ok' })
            console.log(this.socketRegistered);
        })

        this.socket.on('disconnect', (reason: string) => {
            this.bWin.webContents.send('socketStatus', { status: 'error', reason })
            this.socketRegistered = false;
            this.socket.offAny()
            delete this.socket;
        })

        this.socket.on('connect_error', (error: any) => {
            this.bWin.webContents.send('socketStatus', { status: 'error', reason: 'connect_error' })
            this.socketRegistered = false;
            this.socket.offAny()
            delete this.socket;
        });

        this.socket.on('addedAnswer', (questID: string, rawAnswer: string) => {
            if (this.mainTest) {
                const answer: UserAnswer = JSON.parse(rawAnswer)
                this.mainTest.addAnswer(answer, +questID)
            }
        })
    }

}
//TODO combine two routers