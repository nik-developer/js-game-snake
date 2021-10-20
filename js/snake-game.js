const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;


const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

let score = 0;



function drawBorder () {
 ctx.fillStyle = "pink";
 ctx.fillRect(0, 0, width, blockSize);
 ctx.fillRect(0, height - blockSize, width, blockSize);
 ctx.fillRect(0, 0, blockSize, height);
 ctx.fillRect(width - blockSize, 0, blockSize, height);
};

function drawScore() {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Очки: " + score, blockSize, blockSize);
};

function gameOver() {
    // clearInterval(intervalId);
 ctx.font = "60px Courier";
 ctx.fillStyle = "Black";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Конец игры", width / 2, height / 2);
}

function circle(x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};
function get_rand_color()
{
    var color = Math.floor(Math.random() * Math.pow(256, 3)).toString(16);
    while(color.length < 6) {
        color = "0" + color;
    }
    return "#" + color;
}

function Block(col, row) {
    this.col = col;
    this.row = row;
};
Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};
Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col &&
           this.row === otherBlock.row;
};

let Snake = function () {
 this.segments = [
 new Block(7, 5),
 new Block(6, 5),
 new Block(5, 5)
 ];
 this.direction = "right";
 this.nextDirection = "right";
};

Snake.prototype.draw = function () {
 for (let i = 0; i < this.segments.length; i++) {
 this.segments[i].drawSquare(get_rand_color());
 }
};

Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }
    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }
    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
    } else {
        this.segments.pop()
    }
};
    
Snake.prototype.checkCollision = function (head) {
 const leftCollision = (head.col === 0);
 const topCollision = (head.row === 0);
 const rightCollision = (head.col === widthInBlocks - 1);
 const bottomCollision = (head.row === heightInBlocks - 1);
        
    let wallCollision = leftCollision || topCollision
    || rightCollision || bottomCollision;
        
 let selfCollision = false;

 for (let i = 0; i < this.segments.length; i++) {
 if (head.equal(this.segments[i])) {
     selfCollision = true;
     }
 }
return wallCollision || selfCollision;
};

Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }
    this.nextDirection = newDirection;
};

const Apple = function () {
    this.position = new Block(10, 10);
};
Apple.prototype.draw = function() {
    this.position.drawCircle(get_rand_color());
};

Apple.prototype.move = function () {
    let randomCol = ~~(Math.random() * (widthInBlocks - 2)) + 1;
    let randomRow = ~~(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
};

let snake = new Snake();
let apple = new Apple();

setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.draw()
    snake.move();
    apple.draw();
    drawBorder();
}, 100);

const directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
};
document.querySelector("body").addEventListener("keydown", (evt) => {
    const newDirection = directions[evt.keyCode];
        if (newDirection !== undefined) {
        snake.setDirection(newDirection)
    }
});
