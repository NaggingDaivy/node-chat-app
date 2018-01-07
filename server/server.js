const path = require('path');
const http = require('http');
var express = require('express');
const socketIO = require('socket.io');


const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
// var server = http.createServer((req,res) => { // équivalent à app.listen

// }) 
var server = http.createServer(app);
var io = socketIO(server); // socketIO dispo sur localhost:3000/socket.io/socket.io.js
var users = new Users();
var rooms = [];


app.use(express.static(publicPath));
// app.listen(port, () => {
//     console.log(`Server started on port ${port}`);
// })

io.on('connection', (socket) => { // ce qui se passe qd 1 client se connecte au serveur
    // console.log('New user connected');


    socket.on('getRooms',(params,callback) => {
        callback(rooms);
    })

    
    socket.on('join',(params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room))
            return callback('Name and room name are required.')

        socket.join(params.room); // joindre une salle avec socket.io.... EASY !
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        if(!rooms.find((room) => room === params.room )) {
            rooms.push(params.room);
            io.emit('updateRoomList',rooms);
        }
            


       
        //socket.leave(params.room); // quitter une room

        //io.emit -> io.to(params.room).emit va envoyer à TOUS dans la même room
        //socket.broadcast.emit -> socket.broascast.to(params.room) va envoyer à TOUS SAUF L'user
        //socket.emit

        io.to(params.room).emit('updateUserList', users.getUserListByRoom(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app !')); // envoie uniquement au client connecté
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));  // envoie à tout le monde sauf le client connecté

        callback();

    });

    socket.on('createMessage', (message, callback) => { // socket envoie uniquement à la personne conenctée, callback = acknowledgmeent
        
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)); // io.emit envoie à tout le monde  (y compris lui meme)

        } 

       

        callback(); // fonction qui sera triggeredd dans index.js
 
    });

    socket.on('createLocationMessage',(coords) => {

        var user = users.getUser(socket.id);

        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));

    });

    socket.on('disconnect', () => {
        var userRemoved = users.removeUser(socket.id);

        if(userRemoved) {
            io.to(userRemoved.room).emit('updateUserList',users.getUserListByRoom(userRemoved.room))
            io.to(userRemoved.room).emit('newMessage', generateMessage('Admin',`${userRemoved.name} has left.`));

            if(!users.getUserList().find((user) => user.room === userRemoved.room)){
                rooms = rooms.filter((room) => room !== userRemoved.room)
                io.emit('updateRoomList',rooms);

            }
        }

    });

});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
})