import { BrowserWindow, IpcMain, ipcMain } from "electron";
import { io, Socket } from "socket.io-client";

import { Test } from "../engine/Test";
import Getter from "../engine/Getter";

import { QuestionInterface, TestInterface, UserAnswer } from "../helpers/testInteraces";
import { PBCall, Mode, ServerCallbacks, ServerMode, PVCall } from '../helpers/routerInterfaces';

export class MasterRouter {
    getterEngine: Getter;
    bWin: BrowserWindow;
    ipc: IpcMain
    mainTest: Test;
    socket: Socket;
    username: string;
    testName: string;
    operatingMode: Mode;
    serverMode: ServerMode;
    socketRegistered: boolean;

    constructor(window: BrowserWindow) {
        this.ipc = ipcMain;
        this.bWin = window;
        this.socketRegistered = false;
        this.getterEngine = new Getter()

        this.ipc.handle('mode', (e: any, mode: Mode) => {
            this.operatingMode = mode;
        })

        this.ipc.handle('connectSocket', (e: any, URL: string) => {
            this.registerSocket(URL)
        })

        this.ipc.handle('login', async (e: any, apiORUsername: string) => {
            console.log(apiORUsername);
            if (this.serverMode === ServerMode.PUBLIC) {
                return this.publicLogin(apiORUsername)
            } else if (this.serverMode === ServerMode.PRIVATE) {
                return this.privateLogin(apiORUsername)
            } else {
                return new Promise((_, reject) => { reject('Internal server Error') })
            }
        })

        ipcMain.handle('registerTest', (e: any, testURL: string, testName: string) => {
            return new Promise((resolve, reject) => {
                this.getterEngine.removeAllListeners();
                this.getterEngine.getTest(testURL);
                this.getterEngine.on('status', (status: string) => {
                    console.log(status);
                    this.bWin.webContents.send('getter-status', status);
                });
                this.getterEngine.on('ready', (test: Test) => {
                    this.mainTest = test;
                    if (this.operatingMode === Mode.SINGLE) {
                        this.singleTestTunel()
                        resolve(ServerCallbacks.OK)
                    } else if (this.operatingMode === Mode.MULTI) {
                        const rawTest: TestInterface = { id: test.ID, numberOfQuestions: test.numberOfQuestions, questions: test.questions }
                        this.socket.emit('registerTest', testName, JSON.stringify(rawTest), (status: PBCall | PVCall) => {
                            if (status.status === ServerCallbacks.OK) {
                                this.testName = testName;
                                resolve(ServerCallbacks.OK)
                            } else {
                                reject(status.reason)
                            }
                        })
                    }
                })
            })
        })

    }


    private publicLogin(uName: string) {
        return new Promise((resolve, reject) => {
            if (this.socketRegistered) {
                this.socket.emit('login', uName, async (status: PBCall) => {
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
    }

    private privateLogin(apiKey: string) {
        return new Promise((resolve, reject) => {
            if (this.socketRegistered) {
                this.socket.emit('login', apiKey, async (status: PVCall) => {
                    if (status.status === ServerCallbacks.OK) {
                        this.username = status.username
                        resolve(status.username)
                    } else {
                        reject(status.reason)
                    }
                })
            } else {
                reject('Socket is not registered')
            }
        })
    }

    private singleTestTunel() {
        this.ipc.removeHandler('answerAdded');
        this.ipc.removeHandler('answerDeleted');
        this.ipc.removeHandler('test');
        this.ipc.removeAllListeners();

        this.ipc.handle('test', async () => {
            return this.mainTest.cleanTest();
        })

        this.ipc.handle('answerAdded', (e: any, answer: UserAnswer, questID: number) => {
            this.mainTest.addAnswer(answer, questID)
        })
        this.mainTest.on('answerAdded', (q: QuestionInterface) => {
            this.bWin.webContents.send('answerAdded', q)
        })
        this.ipc.handle('answerDeleted', (e: any, username: string, questID: number) => {
            this.mainTest.removeAnswer(username, questID)
        })
        this.mainTest.on('answerDeleted', (q: QuestionInterface) => {
            this.bWin.webContents.send('answerDeleted', q)
        })
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
            console.log(this.socketRegistered);
        })

        this.socket.on('serverMode', (sM: ServerMode) => {
            this.serverMode = sM;
            this.bWin.webContents.send('socketStatus', { status: 'Ok', mode: this.serverMode })
            console.log(this.serverMode);
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