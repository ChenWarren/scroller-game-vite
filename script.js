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
  let enemies = [];
  let score = 0;
  const background = new Background(canvas.width, canvas.height);
  const userInput = new InputHandler();
  const player = new Player(canvas.width, canvas.height);

  let lastEnemyAddedTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 2000;
  let randomEnemyInterval = Math.random() * 1000 - 500;

  function handleEnemies(deltaTime) {
    if( enemyTimer > enemyInterval + randomEnemyInterval){
      enemies.push(new Enemy(canvas.width, canvas.height));
      randomEnemyInterval = Math.random() * 1000 - 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach( enemy => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
      if(enemy.mardedForDeletion) {
        score++;
      }
    })
    enemies = enemies.filter( enemy => !enemy.mardedForDeletion);
  }

  function displayScore(context) {
    context.font = "30px Helvetica";
    context.fillText("Score: " + score, 20, 50);
  }

  function displayMessage(context, message) {
    context.fillRect( canvas.width/2 - 200, canvas.height/2 - 100, 400, 200);
    context.font = "30px Helvetica";
    context.fillStyle = "white";
    context.fillText(message, canvas.width/2 - 100, canvas.height/2);
  }

  function animation(timeStamp){
    const deltaTime = timeStamp - lastEnemyAddedTime;
    lastEnemyAddedTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    player.draw(ctx);
    handleEnemies(deltaTime);
    player.update(userInput, deltaTime, enemies);
    // background.update();
    displayScore(ctx);
    if(!player.gameOver) {
      requestAnimationFrame(animation);
    } else {
      displayMessage(ctx, "Game Over!");
    }
  }
  
  animation(0);
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
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 7;
    this.framePerSecond = 20;
    this.frameTimer = 0;
    this.frameInterval = 1000/this.framePerSecond;
    this.speedY = 0;
    this.speedX = 0;
    this.gravity = 0.9;
    this.gameOver = false;
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x + this.width/2 + 10, this.y + this.height/2 + 20, this.width/2-30, 0, Math.PI * 2);
    context.stroke();
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }
  // Player update method
  update(userInput, deltaTime, enemies) {
    // Collision detection
    enemies.forEach( enemy => {
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if(distance < enemy.width/2 + this.width/2) {
        this.gameOver = true;
      }
    })
    // animation
    if(this.frameTimer > this.frameInterval) {
      if(this.frameX > this.maxFrame) this.frameX = 0;
      else this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    // Input controls
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
      this.maxFrame = 5;
      this.frameY = 1;
    } else {
      this.speedY = 0;
      this.maxFrame = 7;
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
    this.x -= this.speedX;
    if(this.x < 0-this.width) this.x = 0;
  }
}

class Enemy {
  constructor(canvasWidth, canvasHeight){
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.width = 160;
    this.height = 119;
    this.image = document.getElementById('enemyImage');
    this.x = this.canvasWidth;
    this.y = this.canvasHeight - this.height;
    this.frameX = 0;
    this.maxFrame = 4;
    this.framePerSecond = 20;
    this.frameTimer = 0;
    this.frameInterval = 1000/this.framePerSecond;
    this.speedX = 5;
    this.mardedForDeletion = false;
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x + this.width/2 -20, this.y + this.height/2, this.width/2-15, 0, Math.PI * 2);
    context.stroke();
    context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
  }
  update(deltaTime) {
    if(this.frameTimer > this.frameInterval) {
      if(this.frameX > this.maxFrame) this.frameX = 0;
      else this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    this.x -= this.speedX;
    
    if(this.x < (0 - this.width)) {
      this.mardedForDeletion = true;
    }
  }
}

