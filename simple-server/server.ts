import { Server } from "socket.io";
import { CustomSocket, User, Call, ServerCallbacks, ServerReasons, TestInterface, UserAnswer } from './interfaces';

const io = new Server();
const users: Array<User> = [];
const Tests: Map<string, TestInterface> = new Map()
const shortTests: Array<string> = []

const chceckUser = (username: string, socketId: string): boolean => {
    return users.find(u => (u.name === username) && (u.socketId === socketId)) ? true : false
}

const testExist = (name): boolean => {
    return shortTests.find(t => t === name) ? true : false
}

io.on('connection', (socket: CustomSocket) => {
    console.log('con');
    socket.on('setUsername', ((username: string, callback: CallableFunction) => {
        if (chceckUser(username, socket.id)) {
            const res: Call = { status: ServerCallbacks.ERROR, reason: ServerReasons.USEREXIST }
            callback(res)
        } else {
            socket.username = username
            console.log(username);
            const res: Call = { status: ServerCallbacks.OK }
            callback(res)
        }
    }))

    socket.on('getTests', (callback: CallableFunction)=>{
        callback(shortTests)
    })

    socket.on('registerTest', (testName: string, rawTest: string, callback: CallableFunction) => {
        if (testExist(testName)) {
            const res: Call = { status: ServerCallbacks.ERROR, reason: ServerReasons.TESTEXIST }
            callback(res)
        } else {
            const test: TestInterface = JSON.parse(rawTest)
            Tests.set(testName, test)
            shortTests.push(testName)
            socket.join(testName);
            console.log(Tests.get(testName));
            const res: Call = { status: ServerCallbacks.OK }
            callback(res)
        }
    })

    socket.on('JoinTest', (testName, callback: CallableFunction) => {
        if (testExist(testName)) {
            socket.join(testName)
            const test = Tests.get(testName)
            callback({ status: ServerCallbacks.OK, test: test })
        } else {
            const res: Call = { status: ServerCallbacks.ERROR, reason: ServerReasons.TESTEXIST }
            callback(res)
        }
    })

    socket.on('addAnswer', (testName: string, questID: number, rawAnswer: string) => {
        console.log(rawAnswer, testName);
        const answer: UserAnswer = JSON.parse(rawAnswer);
        const test: TestInterface = Tests.get(testName);
        const question = test.questions.find((q) => q.id === questID);
        const update = question.UsersAnswers.find(a => a.username === answer.username)
        if (update) {
            update.answer = answer.answer;
        } else {
            question.UsersAnswers.push(answer);
        }
        socket.to(testName).emit('addedAnswer', questID, rawAnswer)
    })
})


io.listen(4000);