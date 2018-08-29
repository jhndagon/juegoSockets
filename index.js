var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var roomno = 1;
var conexiones = 0;
app.use(express.static('public'))

var usuarios = []
var usuariosPorRoom = []
var coinsPorRoom = new Array(new Array(0))

function Player(id, nick, x, y, puntaje) {
    this.id = id;
    this.nick = nick;
    this.x = x;
    this.y = y;
    this.puntaje = puntaje
}
function Coin(room, id, idS, x, y, valor, nick, color) {
    this.room = room;
    this.idS = idS;
    this.id = id;
    this.x = x;
    this.y = y;
    this.valor = valor;
    this.nick = nick;
    this.color = color;
}
//Envia información a las rooms de las monedas
setInterval(() => {
    coinsPorRoom.forEach((coin, index) => {
        if(conexiones!=0){
            io.sockets.in("room-" + (index + 1)).emit("heartBeatCoin", coin)
        }
    });
}, 33);

//enviar informacion a todas las rooms de la informacion de los jugadores
setInterval(() => {
    usuariosPorRoom.forEach((jugadores, index) => {
        if(conexiones != 0){
            io.sockets.in("room-" + (index + 1)).emit("heartBeat", jugadores)
        }
    });
}, 33);

io.on('connection', function (socket) {
    console.log('usuario conectado');
    conexiones +=1;
    //Increase roomno 2 clients are present in a room.
    if (io.nsps['/'].adapter.rooms["room-" + roomno]
        && io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) {
            ++roomno;
            coinsPorRoom.push(new Array(0))
            coinsPorRoom[roomno - 1].push()

    }
    socket.join("room-" + roomno); 


    if (io.nsps['/'].adapter.rooms["room-" + roomno].length == 2) {
        //llenar vector nposiciones
        io.sockets.in("room-" + roomno).emit('connectToRoom', roomno);

    }


    //informacion del jugador
    socket.on('datos', (datos) => {
        var player = new Player(socket.id, datos.nick, datos.x, datos.y, datos.puntaje)
        datos = { room: roomno, id: Math.floor(Math.random() * 10000) }
        socket.emit('recibirRoom', datos)
        usuarios.push(player)
        if (usuarios.length == 2) {
            usuariosPorRoom.push(usuarios);
            usuarios = [];
        }
    })

    //actualizacion del movimiento del jugador
    socket.on('update', (datos) => {
        var usuario = usuariosPorRoom[datos.room - 1]
        for (var index = 0; usuario !== undefined && index < usuario.length; index++) {
            if (usuario[index].id === socket.id) {
                usuario[index].x = datos.x;
                usuario[index].y = datos.y;
                usuario[index].puntaje = datos.puntaje
            }
        }
    })    

    //informacion de las monedas
    socket.on('datosCoin', (datos) => {
        if (typeof coinsPorRoom[datos.room - 1] === 'undefined' || coinsPorRoom[datos.room - 1].length < 10) {
            co = new Coin(datos.room, datos.id, datos.idS, datos.x, datos.y, datos.valor, datos.nick, datos.color);
            if(coinsPorRoom[datos.room - 1]  && coinsPorRoom[datos.room - 1].length < 3){
                coinsPorRoom[datos.room - 1].push(co)
            }            
        }
    })

    socket.on('updateCoin', (datos) => {
        if (datos != null) {
            coinsRoom = coinsPorRoom[datos.room - 1]
            if (coinsPorRoom !== undefined && datos.room && coinsRoom) {
                coinsRoom.forEach(element => {
                    if (element.idS == socket.id && element.id == datos.id) {
                        element.x = datos.x
                        element.y = datos.y
                        element.valor = datos.valor
                    }
                });
            }
        }
    })

    socket.on('actualizarMonedas', (datos) => {
        if (datos) {
            coinsPorRoom[datos.room - 1] = datos.moneda;
        }
    })

    socket.on('ganador', (gano) => {
        console.log(gano)
        io.sockets.in("room-" + gano.room).emit('gane', gano.gano);
    })

    socket.on('disconnect', function () {
        conexiones -= 1;
        if(conexiones == 0){
            usuarios=[]
            usuariosPorRoom = []
            coinsPorRoom =[]
            coinsPorRoom = new Array(new Array(0))
            roomno = 1;
        }
        console.log("Usuario desconectado "+socket.id)
    });
});

server.listen(process.env.PORT || 3000, function () {
    console.log('Escuchando en localhost:3000')

})
