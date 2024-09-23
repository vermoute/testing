class Pawn {
    constructor() {
      this.originalWidth = gif_createImg.width ;
      this.originalHeight = gif_createImg.height ;
      this.aspectRatio = this.originalWidth / this.originalHeight;
      this.width = 70;      
      this.height = this.width / this.aspectRatio;
      this.x = 170;  
        
      // Match the ground level with Love objects
      const groundRaiseAmount = 40;
      this.y = gameHeight - this.height - groundRaiseAmount;
        
      this.vy = 0;  
      this.gravity = 0.9;
      this.jumpForce = -19;
    }
    
    jump() {
      if (this.y == gameHeight - this.height - 40) {
        this.vy = this.jumpForce;
      } 
      jumpSound.play(); // Play the jump sound
    }
  
    move() {
      this.y += this.vy;
      this.vy += this.gravity;
  
      // Constrain to new ground level
      const groundY = gameHeight - this.height - 40;
      this.y = constrain(this.y, 0, groundY);
        
      if (this.y == groundY) {
        this.vy = 0;
      }
    }
  
    show() {
      gif_createImg.size(this.originalWidth , this.originalHeight );
      gif_createImg.position(this.x + 250, this.y +350);
    }
    
    hits(love) {
      return collideRectRect(
        this.x, this.y, this.width, this.height,
        love.x, love.y, love.width, love.height
      );
    }
  }