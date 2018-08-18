var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var roomno = 1;
app.use(express.static('public'))

var usuarios = []
var usuariosPorRoom = []

io.on('connection', function (socket) {
    console.log('usuario conectado');

    socket.on('datos', (datos) => {
        usuario = datos
        usuario.room = roomno
        usuarios.push(usuario)
        //comprueba que dos jugadores esten conectados
        if (io.nsps['/'].adapter.rooms["room-" + roomno].length == 2) {
            io.sockets.in("room-" + roomno).emit('connectToRoom', usuariosPorRoom[roomno - 1]);
            usuariosPorRoom.push(usuariosPorRoom)
            usuarios = []
        }
        
    })

    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });



    //Incrementa roomno si hay 2 clientes.
    if (io.nsps['/'].adapter.rooms["room-" + roomno]
        && io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) {
        ++roomno;
    }
    socket.join("room-" + roomno);

    setTimeout(() => {
            
    }, 390);

});

server.listen(process.env.PORT || 3000, function () {
    console.log('Escuchando en localhost:3000')
})
