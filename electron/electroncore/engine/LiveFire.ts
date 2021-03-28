import { UserAnswer } from '../../electroncore/helpers/testInteraces';
import { EventEmitter } from 'events';
import { createServer, Server as hServer } from 'http';
import { Server, Socket } from 'socket.io';

export class LiveFire extends EventEmitter {
    ioServer: Server
    testId: string
    httpServer: hServer
    socket: Socket
    currentQuest: number
    constructor() {
        super()
        this.httpServer = createServer();
        this.ioServer = new Server(this.httpServer, { cors: { origin: '*', methods: ["GET", "POST"] } })

        this.ioServer.on('connection', (socket: Socket) => {
            this.socket = socket
            this.emit('liveFireStatus', 'Connected')
            socket.on('setTestID', (id) => {
                console.log(id);
                this.testId = id;
            })

            socket.on('quest', (raw: string) => {
                this.emit('quest', raw)
            })

            socket.on('disconnect',(reason)=>{
                this.emit('liveFireStatus', 'Disconnected')
            })
        })

        this.httpServer.listen(5000)
    }

    answer(answ: Array<UserAnswer>) {
        console.log('mayby work');
        if(this.socket.connected){
            console.log('Work');
            this.socket.emit('answers', answ)
        }
    }
}