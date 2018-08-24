var socket = io()

var nick = window.location.href.split("?usuario=")[1]
var jugador;
var colorFondo = 0;
var jugadores;
var control1 = false;
var control2 = false;
var co;
var hue = new Array(4);
var monedas;
var alto = 500, ancho = 950;

function setup() {
    jugador = new Jugador(nick, 10, 10)
    usuario = { nick: jugador.nick, x: jugador.x, y: jugador.y }
    socket.emit('datos', usuario);
    socket.on('heartBeat', (datos) => {
        jugadores = datos;
        control1 = true
    })
    // en un setInterval hacer que se creen las monedas cada cierta cantidad de tiempo
    co = new moneda(random(0, ancho), random(0, alto), int(random(-100, 100)), socket.id);
    var cnv = createCanvas(ancho, alto);
    cnv.parent('cnv');
    cnv.id('canva');

}

function draw() {
    background(colorFondo);
    jugador.move();
    jugador.show();


    if (control1 && control2) {
        co.move();
        co.show();
        co.colision(jugador)
        /*la moneda que llega del otro jugador debe ser creado como objeto,
        esto para que pueda haber colision con el jugador.
        */
        for(var i = 0; i < monedas.length; i++){
            if(monedas[i].id != socket.id){
                fill(250,247,0)
                if(monedas[i].valor < 0){
                    fill(234,3,3)
                }
                rectMode(CENTER)        
                ellipse(monedas[i].x,monedas[i].y,15,20)
            }
        }
        for (var j = 0; j < 4; j++) {
            hue[j].show();
        }
        for (let index = 0; index < jugadores.length; index++) {
            if (jugadores[index].id !== socket.id) {
                rectMode(CENTER)
                fill(234, 3, 3)
                rect(jugadores[index].x, jugadores[index].y, 25, 25)
            }
        }
        var datosJugador = {
            id: socket.id,
            room: jugador.room,
            x: jugador.x,
            y: jugador.y
        }
        socket.emit('update', datosJugador);

        var datosMoneda = {
            room: jugador.room,
            id: socket.id, //se obtiene del array monedas
            x: co.x,
            y: co.y,
            valor: co.valor
        }

        var datosHueco = {
            x: co.x,
            y: co.y,
            valor: co.valor
        }
        socket.emit('updateCoin', datosMoneda);



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
socket.on('sendholes', (dato) => {
    control2 = true
    for (var j = 0; j < 4; j++) {
        hue[j] = new hueco(dato[j].x, dato[j].y, dato[j].valor);
    }
})

socket.on('recibirRoom', (dato) => {
    jugador.room = dato;
    console.log(co)
    coin = { room: dato, x: co.x, y: co.y, valor: co.valor, id: socket.id }
    socket.emit('datosCoin', coin)
})