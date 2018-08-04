var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var roomno = 1;
app.use(express.static('public'))

var usuario = {
    room: null,
    nombre: null,
    puntaje: null
}

var usuarios = []

io.on('connection', function(socket){
    console.log('usuario conectado');

   /*socket.on('datos',(datos) => {
       console.log(datos)
   })*/
    
    //Increase roomno 2 clients are present in a room.
   if(io.nsps['/'].adapter.rooms["room-"+roomno] 
        && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1){ 
            usuario.room = roomno;
            roomno++;
            console.log(usuario.room)
        }
   socket.join("room-"+roomno);
    
    if(io.nsps['/'].adapter.rooms["room-"+roomno].length == 2){
        io.sockets.in("room-"+roomno).emit('connectToRoom', {usuario});
    }


   //Send this event to everyone in the room.
   

   socket.on('disconnect', function () {    
        console.log('A user disconnected');
     });
});

server.listen(process.env.PORT || 3000, function(){
    console.log('Escuchando en localhost:3000')
})
