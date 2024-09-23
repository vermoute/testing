let bgImage, starImage, coinImage, curtain;
let font;
let stars = [];
let coins = [];
const numStars = 5;
const numCoins = 5;
let backgroundMusic;
let muteButton;
let isMuted = false;

function preload() {

    console.log("Preloading opening assets...");
    bgImage = loadImage('source/Opening/background.png', img => {
        console.log("Background image loaded");
    }, () => {
        console.error("Failed to load background image");
    });
    starImage = loadImage('source/Opening/stars.png');
    coinImage = loadImage('source/Opening/coin.png');
    curtain = loadImage('source/Opening/curtain.png');
    font = loadFont('source/Tazman-Island.ttf');
    
}

function setup() {
    createCanvas(windowWidth, windowHeight);    
    
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: random(windowWidth),
            y: random(windowHeight),
            size: random(100, 300),
            speed: random(0.5, 2)
        });
    }
    for (let i = 0; i < numCoins; i++) {
        coins.push({
            x: random(windowWidth),
            y: random(windowHeight / 2),
            size: random(100, 300),
            speed: random(0.5, 1.5)
        });
    }
     // Initialize background music
     backgroundMusic = document.getElementById("background-music");
     backgroundMusic.volume = 0.5; // Set volume to 50%
     playBackgroundMusic();

     // Initialize mute button
    muteButton = document.getElementById("muteButton");
    muteButton.addEventListener("click", toggleMute);
}

function draw() {
    drawOpeningScreen();
}

function drawOpeningScreen() {
    if (!bgImage) {
        console.error("Background image not loaded yet");
        return;
    }

    let bgAspectRatio = bgImage.width / bgImage.height;
    let bgHeight = windowHeight;
    let bgWidth = bgHeight * bgAspectRatio;
    if (bgWidth < windowWidth) {
        bgWidth = windowWidth;
        bgHeight = bgWidth / bgAspectRatio;
    }
    image(bgImage, 0, 0, bgWidth, bgHeight);

    for (let star of stars) {
        image(starImage, star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > windowHeight) {
            star.y = -star.size;
            star.x = random(windowWidth);
        }
    }

    for (let coin of coins) {
        image(coinImage, coin.x, coin.y, coin.size, coin.size);
        coin.y += coin.speed;
        if (coin.y > windowHeight) {
            coin.y = -coin.size;
            coin.x = random(windowWidth);
        }
    }

    image(curtain, 0, 0, windowWidth, windowHeight);

    fill(252, 219, 228);
    textFont(font);
    textSize(32);
    let textX = width * 0.29;
    let textY = height * 0.57;
    let textWidth = width * 0.42;
    text('This mini-game project critiques the current societal phenomenon where money and material wealth have become the sole measures of success and happiness. In this world, many people are willing to do whatever it takes to obtain the flashy things they desire, even if it means sacrificing more meaningful values.   ', textX, textY, textWidth);
    
    textSize(32);
    textAlign(CENTER, CENTER);
    textY = height * 0.85;
    text('Press "Space" to start and jump, try to earn "money" and avoid "love"', textX, textY, textWidth);
}

function keyPressed() {
    if (key === ' ') {
        console.log("Space key pressed. Navigating to game.html");
        window.location.href = 'game.html';
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}   

function playBackgroundMusic() {
    backgroundMusic.play().catch(error => {
        console.log("Autoplay prevented. User interaction required to start music.");
        document.addEventListener('click', () => {
            backgroundMusic.play();
        }, { once: true });
    });
}

function toggleMute() {
    if (isMuted) {
        backgroundMusic.volume = 0.5;
        muteButton.textContent = "Mute";
    } else {
        backgroundMusic.volume = 0;
        muteButton.textContent = "Unmute";   
    }
    isMuted = !isMuted;
}

// Auto-play music when the page loads
window.addEventListener('load', () => {
    playBackgroundMusic();
});

