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
  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);

  function animation(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    player.update();
    requestAnimationFrame(animation);
  }
  
  animation(player, ctx);
}

class InputHandler {
  constructor(){
    this.keys = new Set();
    window.addEventListener("keydown", (e) => {
      if(( e.key === "ArrowUp" || 
           e.key === "ArrowDown" || 
           e.key === "ArrowLeft" || 
           e.key === "ArrowRight"
          )) {
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

class Player {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.width = 200;
    this.height = 200;
    this.x = 0;
    this.y = this.gameHeight - this.height;
    this.image = document.getElementById('playerImage');
    this.frameX = 1;
    this.frameY = 0;
    this.speed = 0;
  }
  draw(context) {
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }
  update() {
    this.x += this.speed;
  }
}

class Background {

}

class Enemy {

}

