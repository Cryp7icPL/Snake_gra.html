const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;
let lastScores = [
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 }
];
let gameEnded = false;
let intervalId;
let gameSpeed;
let gameStyle;

function startGame(difficulty) {
    switch (difficulty) {
        case 'easy':
            gameSpeed = 250;
            break;
        case 'normal':
            gameSpeed = 100;
            break;
        case 'hard':
            gameSpeed = 50;
            break;
    }
    document.getElementById('menu').style.display = 'none';
    document.getElementById('styleMenu').style.display = 'block';
}

function chooseStyle(style) {
    gameStyle = style;
    if (gameStyle === 'modern') {
        canvas.classList.add('modern');
    } else {
        canvas.classList.remove('modern');
    }
    document.getElementById('styleMenu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    setup();
}

function backToDifficulty() {
    document.getElementById('styleMenu').style.display = 'none';
    document.getElementById('game').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    clearInterval(intervalId);
}

function backToStyle() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('styleMenu').style.display = 'block';
    clearInterval(intervalId);
}

function setup() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();

    clearInterval(intervalId);
    intervalId = window.setInterval(() => {
        if (!gameEnded) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fruit.draw();
            snake.update();
            snake.draw();

            if (snake.eat(fruit)) {
                fruit.pickLocation();
            }

            document.querySelector('.score').innerText = snake.total;
        }
    }, gameSpeed);
}

window.addEventListener('keydown', e => {
    const direction = e.key.replace('Arrow', '');
    snake.changeDirection(direction);
});

document.getElementById('nameForm').addEventListener('submit', e => {
    e.preventDefault();
    const playerName = document.getElementById('playerName').value;
    if (gameEnded) {
        updateLastScores(snake.total, playerName);
        document.getElementById('playerName').value = '';
        gameEnded = false;
        setup(); // Restart the game
    }
});

function moveSnake(direction) {
    snake.changeDirection(direction);
}

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
        ctx.fillStyle = canvas.classList.contains('modern') ? "#8B4513" : "#FFFFFF";

        // Draw snake as rectangles
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
    }

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width) {
            this.x = 0;
        }

        if (this.y >= canvas.height) {
            this.y = 0;
        }

        if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y < 0) {
            this.y = canvas.height - scale;
        }
        
        this.checkCollision();
    }

    this.changeDirection = function(direction) {
        switch (direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    }

    this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            return true;
        }

        return false;
    }

    this.checkCollision = function() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                gameEnded = true;
                return;
            }
        }
    }
}

function Fruit() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
    }

    this.draw = function() {
        ctx.fillStyle = canvas.classList.contains('modern') ? "#FF0000" : "#4cafab";
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

function updateLastScores(score, name) {
    lastScores.push({ name: name, score: score });
    lastScores.sort((a, b) => b.score - a.score);
    lastScores = lastScores.slice(0, 5);

    for (let i = 0; i < lastScores.length; i++) {
        document.querySelector(`.name${i + 1}`).innerText = lastScores[i].name;
        document.querySelector(`.score${i + 1}`).innerText = lastScores[i].score;
    }
}
