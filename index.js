var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var roomno = 1;
app.use(express.static('public'))

var usuarios = []
var usuariosPorRoom = []

var coinsPorRoom = new Array(new Array(0))

function Player(id,nick,x,y){
    this.id = id;
    this.nick = nick;
    this.x = x;
    this.y = y;
}
function Coin(room,id,x,y,valor){
    this.room = room;
    this.id = id;
    this.x = x;
    this.y = y;
    this.valor = valor;
}
function Hueco(x,y,valor){
    this.x = x;
    this.y = y;
    this.valor = valor;
}
//Envia información a las rooms de las monedas
setInterval(() => {
    coinsPorRoom.forEach((coin,index) => {
        io.sockets.in("room-"+(index+1)).emit("heartBeatCoin", coin)        
    });
},33);
//enviar informacion a todas las rooms de la informacion de los jugadores
setInterval(() => {
    usuariosPorRoom.forEach((jugadores,index) => {
        io.sockets.in("room-"+(index+1)).emit("heartBeat",jugadores)        
    });
},33);

io.on('connection', function (socket) {
    console.log('usuario conectado');

    socket.on('datos', (datos) => {
        var player = new Player(socket.id,datos.nick,datos.x,datos.y)
        datos = {room: roomno, id: Math.floor(Math.random()*10000)}
        socket.emit('recibirRoom', datos)
        usuarios.push(player)
        if (usuarios.length == 2) {
            usuariosPorRoom.push(usuarios);
            usuarios = [];
        }        
    })

    socket.on('update', (datos) => {
        
        var usuario = usuariosPorRoom[datos.room-1]
        
        for(var index = 0; usuario !== undefined && index < usuario.length; index++){
            if(usuario[index].id === socket.id){
                usuario[index].x = datos.x;
                usuario[index].y = datos.y;
            }
        }
    })

    //Increase roomno 2 clients are present in a room.
    if (io.nsps['/'].adapter.rooms["room-" + roomno]
        && io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) {
        ++roomno;
        coinsPorRoom.push(new Array(0))
        coinsPorRoom[roomno-1].push()
    }
    socket.join("room-" + roomno);

    if (io.nsps['/'].adapter.rooms["room-" + roomno].length == 2) {
        //llenar vector nposiciones
        io.sockets.in("room-" + roomno).emit('connectToRoom', roomno);
    }
    

    socket.on('datosCoin', (datos) => {
        if(typeof coinsPorRoom[datos.room-1] === 'undefined' || coinsPorRoom[datos.room-1].length < 10){
            co = new Coin(datos.room, datos.id, datos.x, datos.y, datos.valor); 
         
            coinsPorRoom[datos.room-1].push(co)      
        }
    })

    socket.on('updateCoin', (datos) => {
        if(datos != null){
            coinsRoom = coinsPorRoom[datos.room-1]
            if(coinsPorRoom !== undefined && datos.room){
                coinsRoom.forEach(element => {
                    if(element.id == socket.id){
                        element.x = datos.x
                        element.y = datos.y
                    }
                });
            }            
        }        
    })

    socket.on('actualizarMonedas', (datos) => {
        if(datos){
            coinsPorRoom[datos.room-1] = datos.moneda
        }
    })


    socket.on('disconnect', function () {
        id = socket.id
        console.log("Usuario desconectado")
    });
});



server.listen(process.env.PORT || 3000, function () {
    console.log('Escuchando en localhost:3000')
})
