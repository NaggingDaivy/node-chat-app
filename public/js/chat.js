

var socket = io(); // initiating request


// AUTOMATIC SCROLL
function scrollToBottom() {
    // SELECTORS
    var messages = document.getElementById('messages');
    var newMessage = messages.lastElementChild; // on prend le dernier message arrivé
    var lastMessage = messages.children[messages.children.length - 2]; // message avant le new Message
    
    
    // HEIGHTS
    var clientHeight = messages.clientHeight; // ce que voit le client
    // console.log('messages.clientHeight', clientHeight);

    var scrollTop = messages.scrollTop; // valeur de scroll depuis le haut 
    // console.log('messages.scrollTop',scrollTop);

    var scrollHeight = messages.scrollHeight; // taille totale du conatainer avec tout le scroll
    // console.log('messages.scrollHeight',scrollHeight);

    var newMessageHeight =   newMessage.clientHeight;
    // console.log('newMessageHeight',newMessageHeight);

    var lastMessageHeight;

    if(!lastMessage)
        lastMessageHeight = 0; // dans le cas du premier message, lastMessage = newMessage
    else
        lastMessageHeight = lastMessage.clientHeight; // nécessaire pour Firefox, pas pour Chrome
    
        // console.log('lastMessageHeight',lastMessageHeight);

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        // console.log('Should scroll');
        messages.scrollTop = scrollHeight;

    }
        



}

socket.on('connect', function () { // ce qui se passe qd 1 client se connecte au serveur
    console.log('Connected to server');

    var urlSearchParams = window.location.search;
    var searchParams = new URLSearchParams(urlSearchParams);

    var params = { name: searchParams.get('name'), room: searchParams.get('room') };

    socket.emit('join',params, function(err) { // valdiation of params will be on server
        if(err) {
            alert(err);
            window.location.href = '/'; // retourne au login
        }
        else {
            console.log('No error');

        }

    });
 

});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});


socket.on('updateUserList', function(users) {
    // console.log('Users list', users);
    var ol = document.createElement('ol');

    users.forEach(function(user) {
        var li = document.createElement('li');
        li.textContent = user;
        ol.appendChild(li);

    });

    console.log(ol);
    document.getElementById('users').innerHTML = '';
    document.getElementById('users').appendChild(ol);
    

});

socket.on('newMessage', function(message) {

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = document.getElementById('message-template').innerHTML;
   

    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime

    });

    var ol = document.getElementById('messages');
    ol.innerHTML += html;
    scrollToBottom();
    

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
    scrollToBottom();


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