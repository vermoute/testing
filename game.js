let pawn;
let pImg; 
let lImg;
let bImg; 
let cImg;
let love = [];
let coins = [];
let score = 0;
let soundClassifier;
let gameScale;  
let gameWidth = 800;
let gameHeight = 450;
let offsetX = 0;  
let offsetY = 0;
var gif_loadImg, gif_createImg;

let backgroundMusic;
let muteButton;
let isMuted = false;


let spawnInterval = 120; // Reduced initial spawn interval for more frequent spawns
let framesSinceLastSpawn = 0;
let initialSpeed = 7; 
let speedIncrease = 0.5;
let currentSpeed = initialSpeed;
let maxObjectsPerFrame = 4; // Maximum number of objects (love + coins) per spawn
let maxObjectsIncreaseRate = 0.02; // Rate at which maxObjectsPerFrame increases

let initialMinDistance = 250;
let currentMinDistance = initialMinDistance;
let minDistanceDecrease = 0.5; 
 
let eyeballsImg;
let isGameOver = false;


function preload() {  
  const options = {
    probabilityThreshold: 0.95,
  };  
  soundClassifier = ml5.soundClassifier("SpeechCommands18w", options);    
  pImg = loadImage("/source/game/pawn.gif");    
  lImg = loadImage("/source/game/love.png");  
  bImg = loadImage("/source/game/background.png");
  cImg = loadImage("/source/game/coin.png");
  font = loadFont('source/Tazman-Island.ttf');
  gif_createImg = createImg("source/game/pawn.gif");
  eyeballsImg = loadImage('source/game/eyes.png');
  jumpSound = loadSound('Music/jump.wav');
  pickupCoinSound = loadSound('Music/pickupCoin (3).wav');
}     

function calculateGameScale() {
  let scaleX = windowWidth / gameWidth;
  let scaleY = windowHeight / gameHeight;
  gameScale = min(scaleX, scaleY);
  offsetX = (windowWidth - gameWidth * gameScale) / 2;
  offsetY = (windowHeight - gameHeight * gameScale) / 2;
}

function gotCommand(error, results) {
  if (error) {
    console.error(error);
  } 
  console.log(results[0].label, results[0].confidence);
  if (results[0].label == "up") {
    pawn.jump();  
  }
}

function keyPressed() {
  if (key == " ") {
    pawn.jump();
  } else if (key.toLowerCase() === 'c') {
    window.location.href = '01.html';
  }
}

function draw() {
  background(0);
  
  push();
  translate(offsetX, offsetY);
  scale(gameScale);
  
  image(bImg, 0, 0, gameWidth, gameHeight);

  drawEyes();

  
  // Spawn new objects
  framesSinceLastSpawn++;
  if (framesSinceLastSpawn >= spawnInterval) {
    spawnObjects();
    framesSinceLastSpawn = 0;
    
    // Increase speed and adjust spawn interval
    currentSpeed += speedIncrease;
    spawnInterval = max(spawnInterval * 0.99, 30);
    
    // Gradually increase max objects per frame
    maxObjectsPerFrame = min(maxObjectsPerFrame + maxObjectsIncreaseRate, 5);

    // Decrease minimum distance
    currentMinDistance = max(currentMinDistance - minDistanceDecrease, 300); 
  } 

  // Handle love objects
  for (let i = love.length - 1; i >= 0; i--) {
    love[i].move(); 
    love[i].show();
    if (pawn.hits(love[i])) {
      console.log("game over");
      isGameOver = true;
      noLoop();
      redirectToGameOverPage();
      return;
    }
    // Remove object if it's 10px past the left side of the screen
    if (love[i].x + love[i].width < -10) {
      love.splice(i, 1);
    }
  }

  // Handle coin objects
  for (let i = coins.length - 1; i >= 0; i--) {
    coins[i].move();
    coins[i].show();
    if (pawn.hits(coins[i])) {
      score++;  
      pickupCoinSound.play(); // Play the pickup coin sound
      coins.splice(i, 1); 
    } else if (coins[i].x + coins[i].width < -10) {  // Adjust removal condition
      coins.splice(i, 1);
    }
  }
  
  pawn.show();
  pawn.move();


  // Display score
  fill(202, 255, 250);  
  textFont(font);
  textSize(23);
  text(`Score: ${score}`, 20, 30);
  
  pop();

  if (isGameOver) {   
    noLoop();
    redirectToGameOverPage();
  }
}
  
let lastCoinX = -200;  // To store the last X position of a Coin.
let lastLoveX = -200;  // To store the last X position of a Love object.

function spawnObjects() {
  let spawnCount = floor(random(1, maxObjectsPerFrame + 1));
  let lastX = gameWidth - 10;  // Spawning 10px from the right edge
  
  for (let i = 0; i < spawnCount; i++) {
    let isCoin = random() < 0.6; // 60% chance to spawn a coin
    let newObject;
    
    if (isCoin) {
      newObject = new Coin(currentSpeed);
      
      // Ensure a minimum distance between coins
      if (lastX - lastCoinX < 200) {
        lastX += 200 - (lastX - lastCoinX);
      }

      // Ensure a minimum distance between this coin and the last love object
      if (lastX - lastLoveX < 60) {
        lastX += 60 - (lastX - lastLoveX);
      }
      
      newObject.x = lastX;
      lastCoinX = newObject.x; // Update lastCoinX position
      coins.push(newObject);
      
    } else {
      newObject = new Love(currentSpeed);
      
      // Ensure a minimum distance of 300px between love objects
      if (lastX - lastLoveX < 300) {
        lastX += 300 - (lastX - lastLoveX);
      }

      // Ensure a minimum distance of 60px between this love and the last coin object
      if (lastX - lastCoinX < 60) {
        lastX += 60 - (lastX - lastCoinX);  
      }
      
      newObject.x = lastX;
      lastLoveX = newObject.x; // Update lastLoveX position
      love.push(newObject);
    }

    lastX = newObject.x;
  }
}

function resetGame() {
  love = [];
  coins = [];
  score = 0;
  spawnInterval = 120;
  framesSinceLastSpawn = 0;
  currentSpeed = initialSpeed;  
  maxObjectsPerFrame = 3; 
  currentMinDistance = initialMinDistance;
  pawn = new Pawn();
  loop();
}   

let irisDistance = 278;
function drawEyes() {   
  // Draw eyeballs image  
  let eyeballsImgWidth = 180; 
  let eyeballsImgHeight = 113;
 

  // Set the x and y coordinates to position the eye image
  let eyeballsX = 300; // Adjust the x-coordinate  
  let eyeballsY = 10; // Adjust the y-coordinate 

  image(eyeballsImg, eyeballsX, eyeballsY, eyeballsImgWidth, eyeballsImgHeight);


  // Calculate iris positions based on the irisDistance
  let leftX = eyeballsX + irisDistance / 2;
  let rightX = eyeballsX + eyeballsImgWidth - irisDistance / 2;
  let irisY = eyeballsY + 68; 

  // Draw left iris 
  let leftAngle = atan2(mouseY - irisY, mouseX - leftX);
  push();
  translate(leftX, irisY);
  rotate(leftAngle);
  fill(0);
  ellipse(20, 0, 30, 30);
  pop();

  // Draw right iris
  let rightAngle = atan2(mouseY - irisY, mouseX - rightX);
  push();   
  translate(rightX, irisY);
  rotate(rightAngle);
  fill(0);
  ellipse(20, 0, 30, 30);
  pop();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGameScale();
  pawn = new Pawn();
  soundClassifier.classify(gotCommand);
  angleMode(DEGREES); // Set angle mode so that atan2() returns angles in degrees
  // Initialize background music
  backgroundMusic = document.getElementById("background-music");
  backgroundMusic.volume = 0.5; // Set volume to 50%
  playBackgroundMusic();

  // Initialize mute button
 muteButton = document.getElementById("muteButton");
 muteButton.addEventListener("click", toggleMute);
}

function playBackgroundMusic() {
  backgroundMusic.play().catch(error => {
    console.log("Autoplay prevented. Trying to autoplay again...");
    setTimeout(() => {
      playBackgroundMusic();
    }, 1000); // Retry after 1 second
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

function redirectToGameOverPage() {
  window.location.href = '01.html';
}