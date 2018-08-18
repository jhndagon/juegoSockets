var socket = io.connect("http://localhost:3000");
var nick = window.location.href.split("?usuario=")[1];
var player;

function setup(){
    player = new Player(socket.id, nick, null);
    usuario = {
        id: player.id,
        nick: player.nick,
        room: player.room
    }
    socket.emit('datos', usuario);
    var cnv =  createCanvas(400,500);
    cnv.id("micanvas");    
}

function draw(){
    background(237, 34, 93); 

}


socket.on('connectToRoom', function (data) {
    //usuario.id = socket.id;
    //usuario.room = data['usuario'].room
    document.getElementById("datos").innerHTML = nick;
    document.getElementById('micanvas').style.display = 'block';
});
