import { io, Socket } from "socket.io-client";
import { ipcMain, BrowserWindow } from 'electron';
import Getter from '../engine/Getter';
import { Test } from '../engine/Test';
import { Call, QuestionInterface, ServerCallbacks, TestInterface, UserAnswer } from '../helpers/testInteraces';
import { EventEmitter } from 'events';

export class MultiRouter extends EventEmitter {
    role: string;
    getterEngine: Getter;
    bWin: BrowserWindow;
    mainTest: Test;
    socket: Socket
    username: string
    testName: string

    constructor(window: BrowserWindow, socketURL: string) {
        super();
        this.getterEngine = new Getter();
        this.bWin = window;
        this.socket = io(socketURL)
        //TODO: Socket trying somehow reconnect or something slowing seccond call;
        ipcMain.removeHandler('test')
        ipcMain.removeHandler('tests')
        ipcMain.removeHandler('setUsername')
        ipcMain.removeHandler('registerTest')
        ipcMain.removeHandler('JoinTest');
        ipcMain.removeHandler('answerAdded')


        this.socket.on('connect', () => {
            this.emit('ready')
        })

        ipcMain.handle('setUsername', async (e: any, uName: string) => {
            return new Promise((resolve, reject) => {
                this.socket.emit('setUsername', uName, async (status: Call) => {
                    if (status.status === ServerCallbacks.OK) {
                        this.username = uName;
                        resolve(ServerCallbacks.OK)
                    } else {
                        reject(status.reason)
                    }
                })
            })
        })

        ipcMain.handle('tests', () => {
            return new Promise((resolve, reject) => {
                this.socket.emit('getTests', (tests: Array<String>) => {
                    resolve(tests)
                })
            })
        })

        ipcMain.handle('registerTest', (e: any, testURL: string, testName: string) => {
            return new Promise((resolve, reject) => {
                this.getterEngine.removeAllListeners();
                this.getterEngine.getTest(testURL);
                this.getterEngine.on('status', (status: string) => {
                    this.bWin.webContents.send('getter-status', status);
                });
                this.getterEngine.on('ready', (test: Test) => {
                    this.mainTest = test;
                    const rawTest: TestInterface = { id: test.ID, numberOfQuestions: test.numberOfQuestions, questions: test.questions }
                    this.socket.emit('registerTest', testName, JSON.stringify(rawTest), (status: Call) => {
                        if (status.status === ServerCallbacks.OK) {
                            this.testName = testName;
                            this.registerTunel()
                            resolve(ServerCallbacks.OK)
                        } else {
                            reject(status.reason)
                        }
                    })
                })
            })
        })

        ipcMain.handle('JoinTest', async (e: any, testName: string) => {
            return new Promise((resolve, reject) => {
                this.socket.emit('JoinTest', testName, async (status: any) => {
                    if (status.status === ServerCallbacks.OK) {
                        this.mainTest = new Test(status.test)
                        this.testName = testName;
                        console.log(this.testName);
                        this.registerTunel()
                        resolve(ServerCallbacks.OK)
                    } else {
                        reject(status.reason)
                    }
                })
            })
        })

    }

    private registerTunel() {
        ipcMain.removeHandler('answerAdded')
        ipcMain.removeHandler('answerDeleted')
        ipcMain.removeAllListeners();

        ipcMain.handle('test', async () => {
            return this.mainTest.cleanTest();
        })

        ipcMain.handle('answerAdded', (e: any, answer: UserAnswer, questID: number) => {
            console.log(answer);
            const prepAnswer: UserAnswer = { username: this.username, answer: answer.answer }
            console.log(JSON.stringify(prepAnswer));
            this.mainTest.addAnswer(answer, questID)
            this.socket.emit('addAnswer',this.testName, questID, JSON.stringify(prepAnswer))
        })

        this.mainTest.on('answerAdded', (q: QuestionInterface) => {
            this.bWin.webContents.send('answerAdded', q)
        })

        this.socket.on('addedAnswer', (questID: string, rawAnswer: string) => {
            const answer: UserAnswer = JSON.parse(rawAnswer)
            this.mainTest.addAnswer(answer, +questID)
        })
    }

    leave()
    {
        this.socket.disconnect()
        this.socket = null
    }
}