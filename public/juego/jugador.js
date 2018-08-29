function Jugador(nick, x, y, puntaje){
    this.nick = nick;
    this.x = x;
    this.y = y;
    this.room = 0;
    this.puntaje = puntaje;

    this.show = function(){
        rectMode(CENTER)
        fill(100)
        rect(this.x,this.y,25,25)
    }

    this.move = function(){
        
        if(mouseX < 0 || mouseX >800){
            this.x = 800/2;
            return;
        }
        if(mouseY < 0 || mouseY> 350){
            this.y = 400;
            return;
        }
        this.x = mouseX;
        this.y = mouseY;
    }
}