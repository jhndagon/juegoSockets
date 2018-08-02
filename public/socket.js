var socket = io()
socket.on('connectToRoom',function(data) {
    document.body.innerHTML = '';
    document.write(data);
 });



socket.on('connect', function(data){
    console.log('conectado')
})

socket.on('mover', function(data){
    console.log(data)
})