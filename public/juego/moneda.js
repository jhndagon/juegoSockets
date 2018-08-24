function moneda(x,y,valor,id)
{
    this.nick = nick;
    this.x = x;
    this.y = y;
    this.speedy = 10;
    this.speedx = 10;
    this.valor = valor;
    this.id = id

    this.show = function(){
        fill(250,247,0)
        if(valor < 0){
            fill(234,3,3)
        }
        rectMode(CENTER)        
        ellipse(this.x,this.y,15,20)
    }

    this.move = function(){
        this.y += this.speedy;
        if(this.y >= 450){
            this.y = 449;
            this.speedy *= -1 ;
        }
        else if(this.y < 0){
            this.y = 1;
            this.speedy *= -1;
        } 
        this.x += this.speedx;
        if(this.x >= 950){
            this.x = 949;
            this.speedx *= -1 ;
        }
        else if(this.x < 0){
            this.x = 1;
            this.speedx *= -1;
        } 
    }
}