function Player(id, nick, room){
    this.id = id
    this.nick = nick
    this.room = room
    this.x = 10;
    this.y = 20;

    //muestra al jugador
    this.show = function(){
        ellipse(this.x, this.y, 10, 10)
    }


    this.move = function(){

    }

}