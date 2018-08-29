

function login() {
    var usuario = document.getElementsByName("usuario")[0].value;
	if (usuario==""){}
	else{location.href ="carga.html?usuario="+usuario;}   
}