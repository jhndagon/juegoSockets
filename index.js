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
        datos.room = roomno
        socket.emit('recibirRoom', roomno)
        usuarios.push(player)
        if (usuarios.length == 2) {
            usuariosPorRoom.push(usuarios);
            usuarios = [];
        }        
    })

    socket.on('update', (datos) => {
        
        var usuario = usuariosPorRoom[datos.room-1]
        
        for(var index = 0; index < usuario.length; index++){
            if(usuario[index].id === socket.id){
                usuario[index].x = datos.x;
                usuario[index].y = datos.y;
            }
        }
    })
    socket.on('huecos', (datos) => {
        
        var hole = new Hueco(datos.x,datos.y,datos.valor)
        datos.room = roomno
        socket.emit('recibirRoom', roomno)
        usuarios.push(player)
        if (usuarios.length == 2) {
            usuariosPorRoom.push(usuarios);
            usuarios = [];
        }        
    })

    //Increase roomno 2 clients are present in a room.
    if (io.nsps['/'].adapter.rooms["room-" + roomno]
        && io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) {
        ++roomno;
        coinsPorRoom[roomno-1].push()
    }
    socket.join("room-" + roomno);

    if (io.nsps['/'].adapter.rooms["room-" + roomno].length == 2) {
        //llenar vector nposiciones
        io.sockets.in("room-" + roomno).emit('connectToRoom', roomno);
        var huecos = []
        for(var j=0;j<4;j++){
            if(j<2){
                hueco = new Hueco(Math.random(0, 950)*500, Math.random(0, 500)*500,1);
            }
            else{
                hueco = new Hueco(Math.random(0, 950)*500, Math.random(0, 500)*500,-1);
            }
            huecos.push(hueco);
        }
        io.sockets.in("room-" + roomno).emit('sendholes', huecos);
    }
    

    socket.on('datosCoin', (datos) => {
        if(typeof coinsPorRoom[datos.room-1] === 'undefined' || coinsPorRoom[datos.room-1].length < 10){
            co = new Coin(datos.room, datos.id, datos.x, datos.y, datos.valor); 
         
            coinsPorRoom[datos.room-1].push(co)      
        }
        
        //eliminar modenas de coinsPorRoom cuando un usuario la capture
    })

    socket.on('updateCoin', (datos) => {
        if(datos != null){
            coinsRoom = coinsPorRoom[datos.room-1]
            coinsRoom.forEach(element => {
                if(element.id == socket.id){
                    element.x = datos.x
                    element.y = datos.y
                }
            });
            //coinsPorRoom[datos.room-1][datos].x = datos.x;
            //coinsPorRoom[datos.room-1][datos].y = datos.y;
        }
        
    })


    socket.on('disconnect', function () {
        id = socket.id
        console.log("Usuario desconectado")
        
        //buscar como eliminar salas
        /*
        for (let index = 0; index < usuariosPorRoom.length; index++) {
            for (let index1 = 0; index1 < usuariosPorRoom[index].length; index1++) {
                if(usuariosPorRoom[index][index1].id === id){
                    console.log("algo")
                    break;
                }                
            }
            
        }*/

    });
});



server.listen(process.env.PORT || 3001, function () {
    console.log('Escuchando en localhost:3000')
})
