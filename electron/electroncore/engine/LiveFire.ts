import { EventEmitter } from 'events';
import { createServer, Server as hServer } from 'http';
import { Server, Socket } from 'socket.io';

export class LiveFire extends EventEmitter {
    ioServer: Server
    testId: string
    httpServer: hServer
    constructor() {
        super()
        this.httpServer = createServer();
        this.ioServer = new Server(this.httpServer, { cors: { origin: '*', methods: ["GET", "POST"] } })

        this.ioServer.on('connection', (socket: Socket) => {

            socket.on('setTestID', (id) => {
                console.log(id);
                this.testId = id;
            })

            socket.on('quest', (id: string, raw: string) => {
                this.emit('quest', id, raw)
            })
        })

        this.httpServer.listen(5000)
    }
}