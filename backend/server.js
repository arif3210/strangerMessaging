const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const  cors = require('cors')
const app = express()
const server = http.createServer(app)
var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});
// const io = socketIO(server)
const PORT = 5000
const activeconnections = []
io.on('connection',async(socket)=>{
    console.log(`socket connection new`);
    socket.on('newmessage',(message)=>{
        console.log(`event newmessage ${message.username}  ${message.message}`);
        socket.emit('recieveMessage',{uname:message.username,msg:message.message})
    })
})

server.listen(PORT,()=>{
    console.log(`Server Listening at port ${PORT}`);
})