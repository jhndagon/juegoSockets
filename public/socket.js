var socket = io()

var nick = window.location.href.split("?usuario=")[1]
var usuario = {
    id: null,
    nombre: nick,
    room: null
}



socket.emit('datos', { usuario })

socket.on('connectToRoom', function (data) {
    usuario.id = socket.id;
    usuario.room = data['usuario'].room
    document.getElementById("datos").innerHTML = usuario.nombre;
    //document.write(usuario.nombre);
    //document.style(stilo);

    document.onkeydown = desplazar;

    document.getElementById('canvas').style.display = 'block';

    document.addEventListener('keydown', (e) => {
        var tecla = e.keyCode
        socket.emit('informacion', { usuario, tecla })
    },false);   

});

socket.on('recibir', (datos) => {
    console.log(`room: ${datos['usuario'].room}`)
})


socket.on('connect', function (data) {
    console.log('conectado')
})

var posicion = {
    situacionX: 0,
    situacionY: 0
};
function desplazar(objeto) {
    var tecla = objeto.which;

    var situacionY = document.getElementById("cuadrado").offsetLeft;
    var situacionX = document.getElementById("cuadrado").offsetTop;
    switch (tecla) {
        case 37:
            cuadrado.style.left = situacionY - 220 + "px"; 
            posicion.situacionX = situacionY - 220;
            break;
        case 38:
            cuadrado.style.top = situacionX - 220 + "px"; 
            posicion.situacionX = situacionX - 220;
            break;
        case 39:
            cuadrado.style.left = situacionY - 180 + "px"; 
            posicion.situacionX = situacionY - 180;
            break;
        case 40:
            cuadrado.style.top = situacionX - 180 + "px"; 
            posicion.situacionX = situacionX - 180;
            break;
        default:
    }

    socket.emit('posicion', { usuario, posicion })
}

socket.on('dibujar', (datos)=>{
    console.log(datos);

    cuadrado2.style.left = datos.situacionY + "px";
    cuadrado2.style.top = datos.situacionX + "px";
            
})


function desplazarB(objeto) {
    var tecla = objeto.which;


    switch (tecla) {
        case 37:
            cuadrado.style.left = situacionY - 220 + "px"; break;
        case 38:
            cuadrado.style.top = situacionX - 220 + "px"; break;
        case 39:
            cuadrado.style.left = situacionY - 180 + "px"; break;
        case 40:
            cuadrado.style.top = situacionX - 180 + "px"; break;
        default:
    }
}

