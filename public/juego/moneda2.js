function moneda2(nick,x,y)
{
    this.nick = nick;
    this.x = x;
    this.y = y;
    

    this.show = function(){
        rectMode(CENTER)
        fill(100)
        ellipse(this.x,this.y,10,10)
    }

    this.move = function(){
        this.x = this.x  + 8 * 1;
        this.y = this.y + 8 * 1;
    }
}