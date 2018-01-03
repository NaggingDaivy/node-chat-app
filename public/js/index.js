var socket = io(); // initiating request

socket.on('connect', function () { // ce qui se passe qd 1 client se connecte au serveur
    console.log('Connected to server');

    // socket.emit('createMessage', {
    //     from: 'daivy@example.com',
    //     text: 'This is a message created by the client'

    // });

});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});


socket.on('newMessage', function(message) {
    console.log('New Message : ', message);

});
