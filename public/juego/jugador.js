function Jugador(nick, x, y){
    this.nick = nick;
    this.x = x;
    this.y = y;

    this.show = function(){
        rectMode(CENTER)
        fill(100)
        rect(this.x,this.y,10,10)
    }

    this.move = function(){
        this.x = mouseX;
        this.y = mouseY;
    }
}