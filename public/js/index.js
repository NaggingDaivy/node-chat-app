var socket = io(); // initiating request


var updateRoomList = function(rooms) {

    var select = document.getElementById('roomListSelect');
    select.innerHTML = '';
    var optionEmpty = document.createElement('option');
    optionEmpty.text = '';
    select.add(optionEmpty);

    rooms.forEach(room => {
        var option = document.createElement('option');
        option.text = room;

        select.add(option);
    });

}

socket.on('connect', function() {

    // console.log('conenct to server');
    socket.emit('getRooms',undefined, function(rooms) {
        console.log(rooms);
        updateRoomList(rooms);
    });

});


socket.on('updateRoomList', function(rooms){
    console.log(rooms);
   updateRoomList(rooms);

})

document.getElementById('roomListSelect').addEventListener('change', function (event) {
    console.log('Select changed option');
    var element = document.getElementById('roomListSelect');

    var roomInput = document.getElementById('roomInput');
    roomInput.value = element.value;

});
