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
const PORT = 5000
var activeconnections = []
var waitlist = []
var pair = new Map()
io.on('connection',async(socket)=>{
    console.log(`socket connection new ${socket.id}`);
    if(waitlist.length > 0){
        waitlist[waitlist.length -1]
        await socket.emit('pair',waitlist[waitlist.length -1])
        await io.to(waitlist[waitlist.length -1]).emit('pair',socket.id)
        pair.set(socket.id,waitlist[waitlist.length -1])
        console.log(pair);
        waitlist.splice(waitlist[waitlist.length -1],1)
    }else{
        waitlist.push(socket.id)
    }
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`); 
        for(const [key,value] of pair.entries()){
            console.log(pair.entries());
            if(key == socket.id || value == socket.id){
                io.to(key).emit('unpair')
                io.to(value).emit('unpair')
                pair.delete(key)
            }
        }  
        activeconnections = activeconnections.filter(conn => conn.socket !== socket.id); 
        waitlist = waitlist.filter(id => id !== socket.id);
    });
    socket.on('registeruser',(data)=>{
        activeconnections.push(data)
    })
    socket.on('newmessage',async (message)=>{
        await io.to(message.to).emit('recieveMessage',{uname:message.username,msg:message.message})
    })
})

server.listen(PORT,()=>{
    console.log(`Server Listening at port ${PORT}`);
})