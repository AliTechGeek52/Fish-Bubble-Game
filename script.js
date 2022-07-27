// Canvas setup

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let gameFrame = 0;
ctx.font = '60px Montserrat';
let gameSpeed = 1;

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click:false
}

canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top; 
})

canvas.addEventListener('mouseup', function(){
    mouse.click = false;
})


// Player

const playerLeft = new Image();
playerLeft.src = "assets/fish-swim.png";
const playerRight = new Image();
playerRight.src = "assets/fish-right.png";

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy,dx);
        this.angle = theta;
        if (mouse.x != this.x){
            this.x -= dx/20;
        }
        if (mouse.y != this.y) {
            this.y -= dy/20;
        }
    }
    draw(){
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            // ctx.stroke();
        }
        // ctx.fillStyle = 'red';
        ctx.beginPath();
        // ctx.arc(this.x,this.y, this.radius,0, Math.PI *2);
        // ctx.fill();
        ctx.closePath();
        // ctx.fillRect(this.x,this.y,this.radius,10);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if(this.x >= mouse.x) {
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight, 0 -60,0 - 45,this.spriteWidth/2, this.spriteHeight/2);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight, 0 -60,0 - 45,this.spriteWidth/2, this.spriteHeight/2);
        }
        ctx.restore();
    }
}

const player = new Player();
// Bubbles

const bubblesArray =[];
const bubbleImage = new Image();
bubbleImage.src = "assets/bubble_pop_frame_01.png";
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw() {
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x,this.y, this.radius, 0,Math.PI *2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(bubbleImage, this.x - 65, this.y -65, this.radius*2.6, this.radius*2.6);
    }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'assets/sound.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'assets/bubbles-single2.wav';

function handleBubbles (){
    if (gameFrame % 50 == 0 ){
         bubblesArray.push(new Bubble());  
    }
    for (let i=0; i < bubblesArray.length; i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();
        if(bubblesArray[i].y < 0 - bubblesArray[i].radius *2) {
            bubblesArray.splice(i,1);
            i--;
         } else if(bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
              if(!bubblesArray[i].counted) {
                  if(bubblesArray[i].sound == 'sound1') {
                      bubblePop1.play();
                  }
                  else {
                      bubblePop2.play();
                  }
                  score++;
                  bubblesArray[i].counted = true;
                  bubblesArray.splice(i,1);       
              }  
         }
    }
    for (let i=0; i < bubblesArray.length; i++){
       
       
    }
}

// Repeating Backgrounds

const background = new Image();
background.src = "assets/background.png";

function handleBackground() {
    ctx.drawImage(background, 0, 0 , canvas.width, canvas.height);
}


// Animations Loop

function animate() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    handleBackground();
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate);
}

animate();