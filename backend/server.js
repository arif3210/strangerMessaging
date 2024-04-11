const express = require('express')
const http = require('http')
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
var activeconnections = []
var waitlist = []
io.on('connection',async(socket)=>{
    console.log(`socket connection new ${socket.id}`);
    if(waitlist.length > 0){
        waitlist[waitlist.length -1]
        await socket.emit('pair',waitlist[waitlist.length -1])
        waitlist.splice(waitlist[waitlist.length -1],1)
    }else{
        waitlist.push(socket.id)
    }
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);   
        activeconnections = activeconnections.filter(conn => conn.socket !== socket.id); 
        waitlist = waitlist.filter(id => id !== socket.id);
    });
    // socket.to(socket.id).emit('socketdata')
    socket.on('registeruser',(data)=>{
        activeconnections.push(data)
        console.log(activeconnections);
    })
    socket.on('newmessage',async (message)=>{
        console.log(`event newmessage ${message.username}  ${message.message}`);
        await io.emit('recieveMessage',{uname:message.username,msg:message.message})
    })
})

server.listen(PORT,()=>{
    console.log(`Server Listening at port ${PORT}`);
})