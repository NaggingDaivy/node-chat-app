const path = require('path');
const http = require('http');
var express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
var app = express();
// var server = http.createServer((req,res) => { // équivalent à app.listen

// }) 
var server = http.createServer(app);
var io = socketIO(server); // socketIO dispo sur localhost:3000/socket.io/socket.io.js


app.use(express.static(publicPath));
// app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
// })

io.on('connection', (socket) => { // ce qui se passe qd 1 client se connecte au serveur
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'test@example.com',
        text: 'this is a new message send by the sever',
        createdAt: '123'
    });


    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');

    });

});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
})