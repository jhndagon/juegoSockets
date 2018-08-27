var socket = io()

var nick = window.location.href.split("?usuario=")[1]
var jugador;
var colorFondo = 0;
var jugadores;
var control1 = false;
var control2 = false;
var co;
var monedas = [];
var monedas1 = new Array(1);

var alto = 500, ancho = 950;

function setup() {
    // en un setInterval hacer que se creen las monedas cada cierta cantidad de tiempo
    monedas1[0] = new moneda(random(0, ancho), random(0, alto), int(random(-100, 100)), socket.id);

    jugador = new Jugador(nick, random(0, ancho), random(0, alto))
    usuario = { nick: jugador.nick, x: jugador.x, y: jugador.y }
    socket.emit('datos', usuario);
    socket.on('heartBeat', (datos) => {
        jugadores = datos;
        control1 = true
    })

    var cnv = createCanvas(ancho, alto);
    cnv.parent('cnv');
    cnv.id('canva');

}

function draw() {
    background(colorFondo);
    jugador.move();
    jugador.show();

    if (control1 && control2) {
        //co.move()
        //co.show()
        for (let index = 0; index < jugadores.length; index++) {
            if (jugadores[index].id !== socket.id) {
                rectMode(CENTER)
                fill(234, 3, 3);
                rect(jugadores[index].x, jugadores[index].y, 25, 25)
            }
        }
        var datosJugador = {
            id: socket.id,
            room: jugador.room,
            x: jugador.x,
            y: jugador.y,
            puntaje: jugador.puntaje
        }
        socket.emit('update', datosJugador);

        /*la moneda que llega del otro jugador debe ser creado como objeto,
        esto para que pueda haber colision con el jugador.
        */
        for (var i = 0; i < monedas.length; i++) {            
            if (monedas[i].idS != socket.id) {
                if (monedas1[i] == null) {
                    moneda = new moneda(monedas[i].x, monedas[i].y, monedas[i].valor, monedas[i].idS)
                    monedas1.push(moneda)
                }
                
                    monedas1[i].x = monedas[i].x
                    monedas1[i].y = monedas[i].y
                    monedas1[i].valor = monedas[i].valor;
                              
                if (monedas1[i].colision(jugador)) {
                    //monedas1.splice(i, 1)
                    datos = { room: jugador.room, moneda: monedas1 }
                    socket.emit('actualizarMonedas', datos)
                   
                }
            }
            else{
                monedas1[i].move()                
                datos = { room: jugador.room, moneda: monedas1 }
                socket.emit('actualizarMonedas', datos)
            }
            monedas1[i].show()

        }

        /*var datosMoneda = {
            room: jugador.room,
            id: monedas1[0].id,
            idS: socket.id,
            x: monedas1[0].x,
            y: monedas1[0].y,
            valor: monedas1[0].valor
        }*/
        //socket.emit('updateCoin', datosMoneda);
    }
}

socket.on('connectToRoom', function (data) {
    document.getElementById("datos").innerHTML = nick;
    document.getElementById('cnv').style.display = 'block';
    colorFondo = 255;
    if (data) {
        socket.on('heartBeatCoin', (datos) => {
            if (datos !== null) {
                monedas = datos;
            }
        })
        control2 = true;
    }
});

socket.on('recibirRoom', (dato) => {
    jugador.room = dato.room;
    monedas1[0].id = dato.id
    coin = { room: dato.room, x: monedas1[0].x, y: monedas1[0].y, valor: monedas1[0].valor, idS: socket.id, id: dato.id }
    socket.emit('datosCoin', coin)
})