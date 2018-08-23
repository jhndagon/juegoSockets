function Jugador(nick, x, y){
    this.nick = nick;
    this.x = x;
    this.y = y;
    this.room = 0;

    this.show = function(){
        rectMode(CENTER)
        fill(100)
        rect(this.x,this.y,25,25)
    }

    this.move = function(){
        this.x = mouseX;
        this.y = mouseY;
    }
}