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

    // create a li tag, a text, and append text to li
    var li = document.createElement('li');
    li.textContent = `${message.from}: ${message.text}`;

    // insert li into ol
    var ol = document.getElementById('messages');
    ol.appendChild(li);



});

socket.on('newLocationMessage', function(message){
    // create a li tag, a text, and append text to li
    var li = document.createElement('li');
    li.textContent = `${message.from}:`;
    
    

    // a href=url
    var a = document.createElement('a');
    a.setAttribute('target',"_blank");
    a.setAttribute('href',message.url);
    a.textContent = 'My current location';

    li.appendChild(a);
    

    // insert li into ol
    var ol = document.getElementById('messages');
    ol.appendChild(li);


}),


socket.emit('createMessage', {
    from: 'Frank',
    text: 'Hi'
}, function(data) { // when acknowledgement is received by the client

    console.log('Got it', data);
})




// empêchera la page de se rafraichir par défaut quand on fait un submit
document.getElementById('message-form').addEventListener('submit', function(event){
    event.preventDefault(); 

    socket.emit('createMessage', {
        from: 'User',
        text: document.getElementsByName('message')[0].value

    }, function(data) { // when acknowledgement is received by the client

        console.log('Got it', data);
    });
})


/***********************************LOCATION************************************************************************** */
var locationButton = document.getElementById("send-location");

locationButton.addEventListener('click', function (event) {
    if(!navigator.geolocation){
        return alert('Gelocation not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    },function() {
        alert('Unable to fetch position.');

    })

});