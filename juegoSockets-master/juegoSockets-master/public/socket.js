var socket = io({transports: ['websocket'], upgrade: false, 'force new connection': true})


var nick = window.location.href.split("?usuario=")[1]
var jugador;
var colorFondo = 0;
var jugadores;
var control1 = false;
var control2 = false;
var co;
var datos = null;
var monedas1 = new Array(0);
var puntaje;
var alto = 350, ancho = 800;

function setup() {
    jugador = new Jugador(nick, random(0, ancho), random(0, alto),0)
    usuario = { nick: jugador.nick, x: jugador.x, y: jugador.y }
    socket.emit('datos', usuario);
    socket.on('heartBeat', (datos) => {
        jugadores = datos;
        if(jugadores.length == 2){
            control1 = true
        }

    })

    var cnv = createCanvas(ancho, alto);
    cnv.parent('cnv');
    cnv.id('canva');
}

function draw() {
    background(colorFondo);
    if (control1 && control2) {
        jugador.move();
        jugador.show();
        for (let index = 0; index < jugadores.length; index++) {
            if (jugadores[index].id !== socket.id) {
                rectMode(CENTER)
                fill(234, 3, 3);
                rect(jugadores[index].x, jugadores[index].y, 25, 25)                
            }
            puntaje += "Jugador: "+ jugadores[index].nick +", puntaje: " +jugadores[index].puntaje +"<br>"
            document.getElementById('puntaje').innerHTML = puntaje
        }
        puntaje = ""
        var datosJugador = {
            id: socket.id,
            room: jugador.room,
            x: jugador.x,
            y: jugador.y,
            puntaje: jugador.puntaje
        }
        socket.emit('update', datosJugador);


        procesar(datos)
        monedas1.forEach(moneda => {
            moneda.show();
            if (moneda.idS == socket.id) {
                moneda.move()
                var datos = {
                    room: jugador.room,
                    x: moneda.x,
                    y: moneda.y,
                    valor: moneda.valor,
                    idS: socket.id,
                    id: moneda.id
                }
                socket.emit('updateCoin', datos)
            }
            if (moneda.colision(jugador)) {
                

                if(moneda.idS != socket.id){
                    console.log("reducir puntos")
                    jugador.puntaje -= moneda.valor
                }
                else{
                    jugador.puntaje += moneda.valor
                }

                //socket.emit('actualizarMonedas', { room: jugador.room, otro: (moneda.nick != jugador.nick), moneda: monedas1 })
            }

        });

    }

    if(jugador.puntaje > 3000){
        noLoop()
        socket.emit('ganador', {gano: "Ganador: " +jugador.nick, room: jugador.room})
    }
    if(jugador.puntaje < -3000){
        noLoop()
        socket.emit('ganador', {gano: "Perdedor: "+jugador.nick, room: jugador.room})
    }
}

socket.on('connectToRoom', function (data) {
    document.getElementById("datos").innerHTML = nick;
    document.getElementById('cnv').style.display = 'block';
    colorFondo = 255;
    if (data) {
        socket.on('heartBeatCoin', (monedas) => {
            datos = monedas
        })
        control2 = true;
    }
});

socket.on('recibirRoom', (dato) => {    
    jugador.room = dato.room;
    co = new moneda(random(0, ancho), random(0, alto), int(random(0, 100)), 0, socket.id, nick, 0, 250);
    monedas1.push(co);
    monedas1[0].id = dato.id
    monedas1[0].room = jugador.room
    coin = { room: dato.room, x: monedas1[0].x, y: monedas1[0].y, valor: monedas1[0].valor, idS: socket.id, id: dato.id, nick: nick }
    socket.emit('datosCoin', coin)
})

socket.on('gane', (gano) => {
    console.log(gano)
    noLoop()
    document.getElementById('cnv').innerHTML = gano
})
 
function procesar(datos) {
    if (datos !== null) {
        var existe = false
        datos.forEach(elemento => {
            //Comprobar que la moneda sea diferente a alguna creada en este cliente
            if (elemento.idS != socket.id) {
                monedas1.forEach((element) => {
                    //comprueba si existe una moneda ya creada
                    if (element.id == elemento.id && element.idS != socket.id) {
                        existe = true;
                        element.x = elemento.x
                        element.y = elemento.y
                        element.valor = elemento.valor
                    }
                });
                if (!existe) {
                    var co = new moneda(elemento.x, elemento.y, elemento.valor, elemento.id, elemento.idS, elemento.nick, jugador.room,250)
                    monedas1.push(co);
                    socket.emit('actualizarMonedas', { room: jugador.room, moneda: monedas1 })
                }
            }
        });
    }
}

