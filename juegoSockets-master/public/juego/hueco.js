function hueco(x,y,valor)
{
    this.x = x;
    this.y = y;
    this.valor = valor;

    this.show = function(){
        fill(250,247,0)
        if(valor < 0){
            fill(234,3,3)
        }
        rectMode(CENTER)        
        rect(this.x,this.y,15,20)
    }
}