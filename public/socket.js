var socket = io()

var nick = window.location.href.split("?usuario=")[1]
var jugador;
var colorFondo = 0;
var jugadores;
var control1 = false;
var control2 = false;
var co;
var datos = null;
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


        procesar(datos)        
        monedas1.forEach(moneda => {
            moneda.show();
            if (moneda.idS != socket.id) {
                moneda.move()
                var datos = {
                    room: jugador.room,
                    x: moneda.x,
                    y: moneda.y,
                    valor: moneda.valor
                }
                socket.emit('updateCoin', datos)
            }
            moneda.colision(jugador)
            
        });

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
    monedas1[0].id = dato.id
    coin = { room: dato.room, x: monedas1[0].x, y: monedas1[0].y, valor: monedas1[0].valor, idS: socket.id, id: dato.id }
    socket.emit('datosCoin', coin)
})

function procesar(datos){
    if (datos !== null) {
        var existe = false;
        datos.forEach(elemento => {
            //Comprobar que la moneda sea diferente a alguna creada en este cliente
            if (elemento.idS != socket.id) {
                monedas1.forEach((element) => {
                    //comprueba si existe una moneda ya creada
                    if (element.id == elemento.id) {
                        existe = true;
                        element.x = elemento.x
                        element.y = elemento.y
                        element.valor = elemento.valor
                    }
                });
                if (!existe) {
                    var co = new moneda(elemento.x, elemento.y, elemento.valor, elemento.id, elemento.idS)
                    monedas1.push(co)
                }
            }
        });
    }
}