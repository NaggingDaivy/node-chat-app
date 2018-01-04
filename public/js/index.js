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

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = document.getElementById('message-template').innerHTML;
    console.log(template);

    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime

    });

    var ol = document.getElementById('messages');
    ol.innerHTML += html;
    

    //VERSION EN FULL JS SANS MUSTACHE
    // // create a li tag, a text, and append text to li
    // var li = document.createElement('li');
    // li.textContent = `${message.from} ${formattedTime}: ${message.text}`;

    // // insert li into ol
    // var ol = document.getElementById('messages');
    // ol.appendChild(li);
});

socket.on('newLocationMessage', function(message){

    var formattedTime = moment(message.createdAt).format('h:mm a');

    var template = document.getElementById('location-message-template').innerHTML;
    console.log(template);

    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        url: message.url,
        createdAt: formattedTime

    });

    var ol = document.getElementById('messages');
    ol.innerHTML += html;


    //VERSION EN FULL JS SANS MUSTACHE
    // // create a li tag, a text, and append text to li
    // var li = document.createElement('li');
    // li.textContent = `${message.from} ${formattedTime}: `;
    
    

    // // a href=url
    // var a = document.createElement('a');
    // a.setAttribute('target',"_blank");
    // a.setAttribute('href',message.url);
    // a.textContent = 'My current location';

    // li.appendChild(a);
    

    // // insert li into ol
    // var ol = document.getElementById('messages');
    // ol.appendChild(li);


}),


// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'Hi'
// }, function(data) { // when acknowledgement is received by the client

//     console.log('Got it', data);
// })




// empêchera la page de se rafraichir par défaut quand on fait un submit
document.getElementById('message-form').addEventListener('submit', function(event){
    event.preventDefault(); 

    var messageTextbox = document.getElementsByName('message')[0];
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.value

    }, function(data) { // when acknowledgement is received by the client

        // effacer le message une fois qu'on l'a
        messageTextbox.value = '';
    });
})


/***********************************LOCATION************************************************************************** */
var locationButton = document.getElementById("send-location");

locationButton.addEventListener('click', function (event) {
    if(!navigator.geolocation){
        return alert('Gelocation not supported by your browser.');
    }

    locationButton.setAttribute('disabled','disabled')
    locationButton.textContent = 'Sending location...';

    navigator.geolocation.getCurrentPosition(function(position) {

        locationButton.removeAttribute('disabled');
        locationButton.textContent = 'Sending location';
        
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    },function() {
        locationButton.removeAttribute('disabled');
        locationButton.textContent = 'Sending location';
        alert('Unable to fetch position.');

    })

});