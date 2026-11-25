import express from "express";
const app = express()
import http from 'http'
import {Server} from 'socket.io'

const server  = http.createServer(app)

const port  = 3000

let totalUsers = []

const io = new Server(server, {
    cors:{
        origin:"*",
        methods:["GET", 'POST']
    } 
})
 
io.on('connection', (socket)=>{
    console.log('socket Id : ' , socket.id)
    totalUsers.push(socket.id)

    
    socket.on('disconnect',()=>{
        console.log('user disconnect')
        totalUsers.splice(totalUsers.indexOf(socket.id), 1)
        console.log(totalUsers, totalUsers.length)
        io.emit('totalUser', totalUsers.length)
        io.to(socket.room).emit('userDisconnect', socket.name)
    }) 
 
    socket.on('message', (data)=>{ 
        console.log(data)
        // socket.broadcast.emit('message', data)
    
        // io.to(socket.room).emit('message', data)
        socket.to(socket.room).emit('message', data)
    })  


    socket.on('join', (data)=>{
        console.log(data)
        socket.join(data.room)
        socket.name = data.name
        socket.room = data.room
        console.log(data.room)
        io.to(data.room).emit('userjoin', data)
    })

    console.log(totalUsers, totalUsers.length)

     io.emit('totalUser', totalUsers.length)
})

 



app.get('/', (req,res)=>{
    res.send('<h1>server is connected.....</h1>')
})

server.listen(port , ()=>{
    console.log('server is connected on port ', port)
})



