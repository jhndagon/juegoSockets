function moneda(x, y, valor, id, idS, nick, room) {
    this.nick = nick;
    this.x = x;
    this.y = y;
    this.speedy = 8;
    this.speedx = 8;
    this.valor = valor;
    this.id = id
    this.idS = idS
    this.room = room;

    this.show = function () {
        ellipseMode(CENTER)
        fill(250, 247, 0)
        if (valor < 0) {
            fill(234, 3, 3)
        }
        rectMode(CENTER)
        ellipse(this.x, this.y, 15, 20)
    }

    this.move = function () {
        this.y += this.speedy;
        if (this.y >= 350) {
            this.y = 349;
            this.speedy *= -1;
        }
        else if (this.y < 0) {
            this.y = 1;
            this.speedy *= -1;
        }
        this.x += this.speedx;
        if (this.x >= 800) {
            this.x = 799;
            this.speedx *= -1;
        }
        else if (this.x < 0) {
            this.x = 1;
            this.speedx *= -1;
        }
    }

    this.colision = function (jugador) {
        var d = dist(this.x, this.y, jugador.x, jugador.y)

        if (int(d) < 15 + 10) {
            if (this.y > jugador.y - 12 && this.y < jugador.y + 13) {
                this.speedx *= -1
                if (this.x < jugador.x + 10) {
                    this.x = jugador.x - d
                }
                else {
                    this.x = jugador.x + d
                }
            }
            else if (this.x > jugador.x - 12 && this.x < jugador.x + 13) {
                this.speedy *= -1
                if (this.y < jugador.y + 10) {
                    this.y = jugador.y - d
                }
                else {
                    this.y = jugador.y + d
                }
            }
            //jugador.puntaje += this.valor;
            //this.valor *= -1;
            return true;
        }
        return false;
    }
}