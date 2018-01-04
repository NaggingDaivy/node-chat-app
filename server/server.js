const path = require('path');
const http = require('http');
var express = require('express');
const socketIO = require('socket.io');


const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

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



    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app !')); // envoie uniquement au client connecté



    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));  // envoie à tout le monde sauf le client connecté


    socket.on('createMessage', (message, callback) => { // socket envoie uniquement à la personne conenctée, callback = acknowledgmeent
        
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from, message.text)); // io.emit envoie à tout le monde  (y compris lui meme)

        callback(); // fonction qui sera triggeredd dans index.js
 
    });

    socket.on('createLocationMessage',(coords) => {

        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));

    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');

    });

});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
})