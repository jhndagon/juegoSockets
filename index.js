var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var roomno = 1;
app.use(express.static('public'))

app.get('/', function(req, res) {
    res.status(200).send("hola");
});

io.on('connection', function(socket){
    console.log('usuario conectado');

    socket.emit('mover', {
        usuario: 'algo'
    })
    
    //Increase roomno 2 clients are present in a room.
   if(io.nsps['/'].adapter.rooms["room-"+roomno] 
        && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1){ 
            roomno++;
        }
   socket.join("room-"+roomno);

   //Send this event to everyone in the room.
   io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);

   socket.on('disconnect', function () {    
        console.log('A user disconnected');
     });
});

server.listen(3000, function(){
    console.log('Escuchando en localhost:3000')
})
