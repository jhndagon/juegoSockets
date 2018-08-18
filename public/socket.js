var socket = io.connect("http://localhost:3000")
var nick = window.location.href.split("?usuario=")[1]
var usuario;

function setup(){
    usuario = new Player(socket.id, nick, null);
    var cnv =  createCanvas(400,500)
    cnv.parent("canvas")
    cnv.id("micanvas")   
    socket.emit('datos', {usuario})
}

function update(){
    usuario.show()
}




socket.on('connectToRoom', function (data) {
    //usuario.id = socket.id;
    //usuario.room = data['usuario'].room
    document.getElementById("datos").innerHTML = nick;
    document.getElementById('canvas').style.display = 'block';
   

});
