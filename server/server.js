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


    socket.emit('newMessage', { // envoie uniquement au client connecté
        from: 'Admin',
        text: 'Welcome to the chat app'
    });

    socket.broadcast.emit('newMessage', { // envoie à tout le monde sauf le client connecté
        from: 'Admin',
        text: 'New user joined.',
        createdAt: new Date().getTime()
    })

    socket.on('createMessage', (message) => { // socket envoie uniquement à la personne conenctée
        console.log('createMessage', message);
        io.emit('newMessage', { // io.emit envoie à tout le monde  (y compris lui meme)
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

        // socket.broadcast.emit('newMessage', { // envoie le message à tout le monde SAUF à lui même
        //     from: message.from,
        //     text: message.text,
        //     createdAt:  new Date().getTime()
        // }); 
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');

    });

});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
})