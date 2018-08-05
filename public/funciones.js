

function login() {
    var usuario = document.getElementsByName("usuario")[0].value;
    console.log(usuario)
    location.href ="carga.html?usuario="+usuario;
    
}