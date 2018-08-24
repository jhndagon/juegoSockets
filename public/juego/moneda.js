function moneda(x,y,valor,id)
{
    this.nick = nick;
    this.x = x;
    this.y = y;
    this.speedy = 1;
    this.speedx = 1;
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

    this.colision = function(jugador){
        
        if( (this.y >= jugador.y && this.y <= jugador.y +25) 
             || (this.x + 15 >= jugador.y && this.y + 25 <= jugador.y +25 )){ 

                //if(this.speedx > 0){
                    //this.speedx += 1;
                //}
                //else{
                    this.speedx *= -1; 
                //}
            console.log("colisioono");
        }
        else if(this.x +25 >= jugador.x && this.x + 25 <= jugador.x +25){
            this.speedy *= -1;
            
        }
    }
}