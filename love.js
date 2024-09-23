class Love {
    constructor(speed) {
        this.width = 80;  // Base width
        this.height = this.width * (lImg.height / lImg.width);  // Maintain aspect ratio
        this.x = gameWidth;
        
        // Two possible vertical positions
        const groundRaiseAmount = 80;
        const lowerPosition = gameHeight - this.height - groundRaiseAmount;
        const upperPosition = lowerPosition - 100;  // 100 pixels above the lower position
        
        // Biased random choice: 70% chance for lower position, 30% chance for upper position
        this.y = random() < 0.7 ? lowerPosition : upperPosition;

        this.speed = speed;
    }

    move() {    
        this.x -= this.speed;
    }

    show() {
        image(lImg, this.x, this.y, this.width, this.height);
    }
}   