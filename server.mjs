import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()
const io = new Server(httpServer,{
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

let players = []

io.on("connection", async socket => {
    socket.on('login', userData => {
        userData = JSON.parse(userData)
        players.push({id: userData.id, nick: userData.nick, color: userData.color})

        socket.id = userData.id
        socket.nick = userData.nick
        
        console.log(`connected: ${userData.nick}`)
        io.emit('update', players)
    })

    socket.on('disconnect',()=>{
        console.log(`disconnected: ${socket.nick}`)
        players = players.filter(player => player.id != socket.id)
        io.emit('update', players)
    })
})

httpServer.listen(3003, () => {
  console.log('server running')  
})

// client.sockket.on()  i sercer.socket.on() and emits