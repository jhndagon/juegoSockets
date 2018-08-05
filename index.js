var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var roomno = 1;
app.use(express.static('public'))

var usuario = {
    id: null,    
    nombre: null,
    room: null
}

var usuarios = []

io.on('connection', function(socket){
    console.log('usuario conectado');

   socket.on('datos',(datos) => {
       usuario = datos['usuario']
   })
    
    //Increase roomno 2 clients are present in a room.
   if(io.nsps['/'].adapter.rooms["room-"+roomno] 
        && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1){            
            ++roomno;                         
    }
   socket.join("room-"+roomno);
    
    if(io.nsps['/'].adapter.rooms["room-"+roomno].length == 2){        
        usuario.room = roomno;
        io.sockets.in("room-"+roomno).emit('connectToRoom', {usuario});
    }

    socket.on('informacion', (data) => {
        io.sockets.in("room-"+data['usuario'].room).emit('recibir', data)
    })

    socket.on('posicion', (datos) => {
        console.log(datos);
        io.sockets.in("room-"+datos['usuario'].room).emit('dibujar',datos['posicion'])
    })
   

   socket.on('disconnect', function () {    
        console.log('A user disconnected');
     });
});

server.listen(process.env.PORT || 3000, function(){
    console.log('Escuchando en localhost:3000')
})
