//角色类
class Charactor {
    constructor(left, top, xSpeed, ySpeed, width, height, onReachEdge) {
        this.left = left;
        this.top = top;
        this.xSpeed = xSpeed; //每秒钟移动多少个像素
        this.ySpeed = ySpeed;
        this.dom = this.getDom();
        this.width = width;
        this.height = height;
        this.onReachEdge = onReachEdge;
        this.hasAppendedToPage = false;//是否加入到了页面上
        this.show();
    }

    //tick表示秒数
    move(tick) {
        var xDis = this.xSpeed * tick,
            yDis = this.ySpeed * tick,
            newLeft = this.left + xDis,
            newTop = this.top + yDis;
        if (newLeft <= 0) {
            newLeft = 0;
            this.onReachEdge && this.onReachEdge("left");
        }
        else if (newLeft > (Game.width - this.width)) {
            newLeft = Game.width - this.width;
            this.onReachEdge && this.onReachEdge("right");
        }
        if (newTop <= 0) {
            newTop = 0;
            this.onReachEdge && this.onReachEdge("top");
        }
        else if (newTop > (Game.height - this.height)) {
            newTop = Game.height - this.height;
            this.onReachEdge && this.onReachEdge("bottom");
        }
        this.left = newLeft;
        this.top = newTop;
        this.show();
    }

    show() {
        this.dom.style.left = this.left + "px";
        this.dom.style.top = this.top + "px";
        if (!this.hasAppendedToPage) {
            Game.charactorDom.appendChild(this.dom);
        }
    }

    touched(otherCharactor) {
        //比较中心点坐标距离
        var xDis = Math.abs(this.left + this.width / 2 - (otherCharactor.left + otherCharactor.width / 2))
        var yDis = Math.abs(this.top + this.height / 2 - (otherCharactor.top + otherCharactor.height / 2))
        xDis += 5;//修正
        yDis += 5;
        if (xDis <= (this.width + otherCharactor.width) / 2 && yDis <= (this.height + otherCharactor.height) / 2) {
            return true;
        }
        return false;
    }
}

//英雄类
class Hero extends Charactor {

    static width = 32;
    static height = 32;

    constructor(left, top) {
        super(left, top, 0, 0, Hero.width, Hero.height);
    }

    getDom() {
        var div = document.createElement("div");
        div.className = "hero";
        return div;
    }
}

class Monster extends Charactor {
    static width = 30;
    static height = 32;

    constructor(left, top, xSpeed, ySpeed) {
        super(left, top, xSpeed, ySpeed, Monster.width, Monster.height, type => {
            if (type === "left" || type === "right") {
                this.xSpeed = -this.xSpeed;
            }
            else {
                this.ySpeed = -this.ySpeed;
            }
        });
    }

    getDom() {
        var div = document.createElement("div");
        div.className = "monster";
        return div;
    }
}

class Time {
    constructor() {
        this.duration = 0; //经过的毫秒数
        this.tick = 50; //每隔50毫秒变动一次
        this.dom = document.querySelector(".time");
        this.timer = null;
        this.show();
    }

    toString() {
        //得到分钟
        var m = parseInt(this.duration / (1000 * 60));
        //秒钟
        var s = parseInt((this.duration - m * 60 * 1000) / 1000);
        //毫秒
        var ms = this.duration - m * 60 * 1000 - s * 1000;
        ms = ms.toFixed()
        //转换格式
        m = m.toString().padStart(2, "0");
        s = s.toString().padStart(2, "0");
        ms = ms.toString().padStart(2, "0").substr(0, 2);
        return `${m}:${s}:${ms}`;
    }

    show() {
        this.dom.innerText = this.toString();
    }

    start() {
        if (this.timer) {
            return;
        }
        this.timer = setInterval(() => {
            this.duration += this.tick;
            this.show();
        }, this.tick);
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }
}

class Game {
    static width = 512;
    static height = 480;
    static charactorDom = document.getElementById("charactors");

    constructor() {
        this.init();
        this.timerForCreateMonster = null;
        this.timerForMove = null;
        this.tickForMove = 16;
        this.tickForCreateMonster = 1500;
        this.isOver = false;
    }

    init() {
        this.isOver = false;
        this.time = new Time();
        Game.charactorDom.innerHTML = "";//清空
        const initHero = () => {
            this.hero = new Hero((Game.width - Hero.width) / 2, (Game.height - Hero.height) / 2);
        }
        const initMonsters = () => {
            this.monsters = [];
        }
        const regDomEvent = () => {
            window.onkeydown = (e) => {
                var speed = 200;
                if (e.key === "ArrowDown") {
                    this.hero.ySpeed = speed;
                }
                else if (e.key === "ArrowUp") {
                    this.hero.ySpeed = -speed;
                }
                else if (e.key === "ArrowLeft") {
                    this.hero.xSpeed = -speed;
                }
                else if (e.key === "ArrowRight") {
                    this.hero.xSpeed = speed;
                }
            }

            window.onkeyup = (e) => {
                if (e.key === "ArrowDown" && this.hero.ySpeed > 0 || e.key === "ArrowUp" && this.hero.ySpeed < 0) {
                    this.hero.ySpeed = 0;
                }
                else if (e.key === "ArrowLeft" && this.hero.xSpeed < 0 || e.key === "ArrowRight" && this.hero.xSpeed > 0) {
                    this.hero.xSpeed = 0;
                }
            }
        }
        initHero();
        initMonsters();
        regDomEvent();
    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    createMonster() {
        var left = 0;
        var top = 0;
        var xSpeed = this.getRandom(10, 100);
        var ySpeed = this.getRandom(10, 100);
        return new Monster(left, top, xSpeed, ySpeed);
    }

    start() {
        this.startMove();
        this.startCreateMonster();
        this.time.start();
    }

    stop() {
        this.stopMove();
        this.stopCreateMonster();
        this.time.stop();
    }

    startCreateMonster() {
        if (this.timerForCreateMonster) {
            return;
        }
        this.timerForCreateMonster = setInterval(() => {
            this.monsters.push(this.createMonster());
        }, this.tickForCreateMonster)
    }

    stopCreateMonster() {
        clearInterval(this.timerForCreateMonster);
        this.timerForCreateMonster = null;
    }

    startMove() {
        if (this.timerForMove) {
            return;
        }
        this.timerForMove = setInterval(() => {
            //移动英雄
            this.hero.move(this.tickForMove / 1000);
            //移动怪物
            this.monsters.forEach(m => {
                m.move(this.tickForMove / 1000);
            })
            //检查碰撞
            if (this.isTouchHero()) {
                this.gameOver();
            }
        }, this.tickForMove)
    }

    gameOver() {
        this.stop();
        setTimeout(() => {
            alert("游戏结束，用时：" + this.time.toString())
        }, 20);
    }

    stopMove() {
        clearInterval(this.timerForMove);
        this.timerForMove = null;
    }

    isTouchHero() {
        for (const m of this.monsters) {
            if (m.touched(this.hero)) {
                return true;
            }
        }
        return false;
    }
}

var g = new Game();
g.start();
document.querySelector('button').onclick = function () {
    Game.init();
}