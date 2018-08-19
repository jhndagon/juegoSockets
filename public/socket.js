var socket = io()

var nick = window.location.href.split("?usuario=")[1]
var jugador;
var colorFondo = 0;
var jugadores;
var control = false;

function setup() {
    jugador = new Jugador(nick, 10, 10)
    usuario = { nick: jugador.nick, x: jugador.x, y: jugador.y }
    socket.emit('datos', usuario);
    var cnv = createCanvas(500, 500);
    cnv.parent('cnv');
    cnv.id('canva');
    socket.on('hardBeat', (datos) => {
        jugadores = datos;
        control = true;
    })
}

function draw() {
    background(colorFondo);
    jugador.move();
    jugador.show();
    
    if(control){

        for (let index = 0; index < jugadores.length; index++) {
            if(jugadores[index].id !== socket.id){
                rectMode(CENTER)
                fill(195)
                rect(jugadores[index].x,jugadores[index].y,25,25)
            }    
        }
        var datosJugador = {
            id: socket.id,
            room: jugador.room,
            x: jugador.x,
            y:jugador.y
        }        
        socket.emit('update', datosJugador);       
    }
}

socket.on('connectToRoom', function (data) {
    document.getElementById("datos").innerHTML = nick;
    document.getElementById('cnv').style.display = 'block';
    colorFondo = 255;
    
});

socket.on('recibirRoom', (dato) => {
    jugador.room = dato;
})

