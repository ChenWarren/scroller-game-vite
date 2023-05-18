/**
 * @type {HTMLCanvasElement}
 */

window.onload = function() {
  game();
}

function game() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 720;
  const background = new Background(canvas.width, canvas.height);
  const userInput = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  const enemy = new Enemy(canvas.width, canvas.height);

  function animation(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    player.draw(ctx);
    enemy.draw(ctx);
    player.update(userInput);
    background.update();
    requestAnimationFrame(animation);
  }
  
  animation(player, ctx);
}

// Detect keyboard userInput
class InputHandler {
  constructor(){
    this.keys = new Set();
    window.addEventListener("keydown", (e) => {
      if(( e.key === "ArrowUp" || 
           e.key === "ArrowDown" || 
           e.key === "ArrowLeft" || 
           e.key === "ArrowRight"
        )) {
        this.keys.add(e.key);
      }
    })
    window.addEventListener("keyup", (e) => {
      if((e.key === "ArrowUp" ||
          e.key === "ArrowDown"  ||
          e.key === "ArrowLeft"  ||
          e.key === "ArrowRight" 
        )) {
        this.keys.delete(e.key);
      } 
    })
  }
}

// Player class
class Player {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.width = 200;
    this.height = 200;
    this.x = 0;
    this.y = this.canvasHeight - this.height;
    this.image = document.getElementById('playerImage');
    this.frameX = 1;
    this.frameY = 0;
    this.speedY = 0;
    this.speedX = 0;
    this.gravity = 0.9;
  }
  draw(context) {
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }
  // Player update method
  update(userInput) {
    if( userInput.keys.has("ArrowRight")){
      this.speedX = 5;
    } else if(userInput.keys.has("ArrowLeft")){
      this.speedX = -5;
    } else if(userInput.keys.has("ArrowUp") && this.onGround()) {
      this.speedY -= 30;
    } else {
      this.speedX = 0;
    }
    // Horizontal movemen
    this.x += this.speedX;
    if(this.x<0) this.x =0;
    if(this.x > this.canvasWidth - this.width) this.x = this.canvasWidth - this.width;
    // Vertical movement
    this.y += this.speedY;
    if(!this.onGround()){
      this.speedY += this.gravity;
      this.frameY = 1;
    } else {
      this.speedY = 0;
      this.frameY = 0;
    }
    if(this.y > this.canvasHeight - this.height) this.y = this.canvasHeight - this.height;
  }
  onGround() {
    return this.y >= this.canvasHeight - this.height;
  }
}

class Background {
  constructor(canvasWidth, canvasHeight){
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.image = document.getElementById('backgroundImage');
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 720;
    this.speedX = 5;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y);
    context.drawImage(this.image, this.x + this.width - this.speedX, this.y);
  }
  update() {
    // this.x -= this.speedX;
    // if(this.x < 0-this.width) this.x = 0;
  }
}

class Enemy {
  constructor(canvasWidth, canvasHeight){
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.width = 160;
    this.height = 119;
    this.image = document.getElementById('enemyImage');
    this.x = this.canvasWidth - this.width;
    this.y = this.canvasHeight - this.height;
    this.frameX = 0;
  }
  draw(context) {
    context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
  }
}

