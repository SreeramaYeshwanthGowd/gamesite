// Racing Game for Purvi Pinki Games
// A simple 2D top-down racing game

class RacingGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.container.innerHTML = '';
        
        // Game canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.container.appendChild(this.canvas);
        
        // Game state
        this.gameRunning = false;
        this.gameOver = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.speed = 5;
        
        // Car properties
        this.car = {
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 100,
            width: 50,
            height: 80,
            speed: 0,
            maxSpeed: 8,
            acceleration: 0.2,
            deceleration: 0.1,
            handling: 5,
            color: '#ff6b6b'
        };
        
        // Track properties
        this.track = {
            width: 300,
            roadColor: '#333',
            lineColor: '#fff',
            lineWidth: 10,
            lineGap: 40,
            lines: [],
            obstacles: [],
            coins: []
        };
        
        // Controls
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        
        // Create UI elements
        this.createUI();
        
        // Add game-specific CSS
        this.addStyles();
        
        // Initialize the game
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Make canvas responsive
        this.resizeCanvas();
        
        // Show start screen
        this.showStartScreen();
    }
    
    createUI() {
        // Game controls
        this.controls = document.createElement('div');
        this.controls.className = 'racing-controls';
        this.container.appendChild(this.controls);
        
        // Game info display
        this.infoDisplay = document.createElement('div');
        this.infoDisplay.className = 'racing-info';
        this.infoDisplay.innerHTML = `
            <div class="racing-score">Score: <span>0</span></div>
            <div class="racing-lives">Lives: <span>3</span></div>
            <div class="racing-level">Level: <span>1</span></div>
        `;
        this.container.appendChild(this.infoDisplay);
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
                e.preventDefault();
            }
            
            // Start game on space
            if (e.key === ' ' && !this.gameRunning) {
                this.startGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
                e.preventDefault();
            }
        });
        
        // Touch controls for mobile
        this.setupTouchControls();
        
        // Make canvas responsive
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    setupTouchControls() {
        // Create touch control buttons
        const touchControls = document.createElement('div');
        touchControls.className = 'touch-controls';
        
        const upButton = document.createElement('button');
        upButton.className = 'touch-btn up-btn';
        upButton.innerHTML = '▲';
        
        const downButton = document.createElement('button');
        downButton.className = 'touch-btn down-btn';
        downButton.innerHTML = '▼';
        
        const leftButton = document.createElement('button');
        leftButton.className = 'touch-btn left-btn';
        leftButton.innerHTML = '◀';
        
        const rightButton = document.createElement('button');
        rightButton.className = 'touch-btn right-btn';
        rightButton.innerHTML = '▶';
        
        touchControls.appendChild(upButton);
        touchControls.appendChild(downButton);
        touchControls.appendChild(leftButton);
        touchControls.appendChild(rightButton);
        
        this.controls.appendChild(touchControls);
        
        // Touch event handlers
        const handleTouchStart = (key, e) => {
            this.keys[key] = true;
            e.preventDefault();
        };
        
        const handleTouchEnd = (key, e) => {
            this.keys[key] = false;
            e.preventDefault();
        };
        
        // Add touch events to buttons
        upButton.addEventListener('touchstart', (e) => handleTouchStart('ArrowUp', e));
        upButton.addEventListener('touchend', (e) => handleTouchEnd('ArrowUp', e));
        
        downButton.addEventListener('touchstart', (e) => handleTouchStart('ArrowDown', e));
        downButton.addEventListener('touchend', (e) => handleTouchEnd('ArrowDown', e));
        
        leftButton.addEventListener('touchstart', (e) => handleTouchStart('ArrowLeft', e));
        leftButton.addEventListener('touchend', (e) => handleTouchEnd('ArrowLeft', e));
        
        rightButton.addEventListener('touchstart', (e) => handleTouchStart('ArrowRight', e));
        rightButton.addEventListener('touchend', (e) => handleTouchEnd('ArrowRight', e));
    }
    
    resizeCanvas() {
        const containerWidth = this.container.clientWidth;
        const scale = Math.min(1, containerWidth / this.canvas.width);
        
        this.canvas.style.width = `${this.canvas.width * scale}px`;
        this.canvas.style.height = `${this.canvas.height * scale}px`;
    }
    
    showStartScreen() {
        // Clear canvas
        this.ctx.fillStyle = '#118ab2';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw title
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '40px "Bubblegum Sans", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Racing Game', this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        // Draw instructions
        this.ctx.font = '20px "Comic Neue", sans-serif';
        this.ctx.fillText('Use Arrow Keys to control your car', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText('Avoid obstacles and collect coins', this.canvas.width / 2, this.canvas.height / 2 + 30);
        this.ctx.fillText('Press SPACE to start', this.canvas.width / 2, this.canvas.height / 2 + 80);
        
        // Add start button for touch devices
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.className = 'game-button';
        startButton.addEventListener('click', () => {
            this.startGame();
            startButton.remove();
        });
        
        this.controls.innerHTML = '';
        this.controls.appendChild(startButton);
        
        // Setup touch controls
        this.setupTouchControls();
    }
    
    startGame() {
        // Reset game state
        this.gameRunning = true;
        this.gameOver = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.speed = 5;
        
        // Reset car position
        this.car.x = this.canvas.width / 2 - this.car.width / 2;
        this.car.y = this.canvas.height - 100;
        this.car.speed = 0;
        
        // Initialize track elements
        this.initTrack();
        
        // Update display
        this.updateInfoDisplay();
        
        // Start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
        
        // Play start sound
        if (window.gameUtils) {
            window.gameUtils.playSound('gameStart');
        }
        
        // Play car engine sound
        if (window.gameUtils) {
            window.gameUtils.playSound('carEngine');
        }
    }
    
    initTrack() {
        // Initialize road lines
        this.track.lines = [];
        const linesCount = Math.ceil(this.canvas.height / (this.track.lineWidth + this.track.lineGap)) + 1;
        
        for (let i = 0; i < linesCount; i++) {
            this.track.lines.push({
                y: i * (this.track.lineWidth + this.track.lineGap)
            });
        }
        
        // Initialize obstacles and coins
        this.track.obstacles = [];
        this.track.coins = [];
        
        // Generate initial obstacles
        this.generateObstacles();
    }
    
    generateObstacles() {
        // Clear existing obstacles that are off-screen
        this.track.obstacles = this.track.obstacles.filter(obstacle => obstacle.y < this.canvas.height);
        
        // Add new obstacles if needed
        while (this.track.obstacles.length < 3 + this.level) {
            const minX = (this.canvas.width - this.track.width) / 2 + 20;
            const maxX = (this.canvas.width + this.track.width) / 2 - 70;
            
            const obstacle = {
                x: minX + Math.random() * (maxX - minX),
                y: -100 - Math.random() * 300,
                width: 50 + Math.random() * 30,
                height: 30 + Math.random() * 20,
                color: '#ff0000'
            };
            
            // Ensure obstacles don't overlap
            const overlaps = this.track.obstacles.some(existing => 
                Math.abs(existing.y - obstacle.y) < 150
            );
            
            if (!overlaps) {
                this.track.obstacles.push(obstacle);
            }
        }
        
        // Generate coins
        while (this.track.coins.length < 5) {
            const minX = (this.canvas.width - this.track.width) / 2 + 30;
            const maxX = (this.canvas.width + this.track.width) / 2 - 30;
            
            const coin = {
                x: minX + Math.random() * (maxX - minX),
                y: -100 - Math.random() * 500,
                radius: 15,
                color: '#ffd166'
            };
            
            // Ensure coins don't overlap with obstacles
            const overlapsObstacle = this.track.obstacles.some(obstacle => 
                Math.abs(obstacle.y - coin.y) < 100 &&
                Math.abs(obstacle.x - coin.x) < 50
            );
            
            if (!overlapsObstacle) {
                this.track.coins.push(coin);
            }
        }
    }
    
    gameLoop(currentTime) {
        if (!this.gameRunning) return;
        
        // Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update game state
        this.update(deltaTime);
        
        // Render game
        this.render();
        
        // Continue game loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // Update car position based on controls
        this.updateCar(deltaTime);
        
        // Update track elements
        this.updateTrack(deltaTime);
        
        // Check collisions
        this.checkCollisions();
        
        // Check if level should increase
        if (this.score > 0 && this.score % 10 === 0) {
            this.levelUp();
        }
    }
    
    updateCar(deltaTime) {
        // Acceleration and deceleration
        if (this.keys.ArrowUp) {
            this.car.speed += this.car.acceleration;
            if (this.car.speed > this.car.maxSpeed) {
                this.car.speed = this.car.maxSpeed;
            }
        } else if (this.keys.ArrowDown) {
            this.car.speed -= this.car.acceleration * 2;
            if (this.car.speed < -this.car.maxSpeed / 2) {
                this.car.speed = -this.car.maxSpeed / 2;
            }
        } else {
            // Natural deceleration
            if (this.car.speed > 0) {
                this.car.speed -= this.car.deceleration;
                if (this.car.speed < 0) this.car.speed = 0;
            } else if (this.car.speed < 0) {
                this.car.speed += this.car.deceleration;
                if (this.car.speed > 0) this.car.speed = 0;
            }
        }
        
        // Steering
        if (this.keys.ArrowLeft) {
            this.car.x -= this.car.handling * (this.car.speed / this.car.maxSpeed);
        }
        if (this.keys.ArrowRight) {
            this.car.x += this.car.handling * (this.car.speed / this.car.maxSpeed);
        }
        
        // Keep car within road boundaries
        const roadLeft = (this.canvas.width - this.track.width) / 2;
        const roadRight = (this.canvas.width + this.track.width) / 2;
        
        if (this.car.x < roadLeft) {
            this.car.x = roadLeft;
            this.car.speed *= 0.9; // Slow down when hitting edge
        }
        if (this.car.x + this.car.width > roadRight) {
            this.car.x = roadRight - this.car.width;
            this.car.speed *= 0.9; // Slow down when hitting edge
        }
    }
    
    updateTrack(deltaTime) {
        // Move road lines
        for (let i = 0; i < this.track.lines.length; i++) {
            this.track.lines[i].y += (this.car.speed + this.speed) * deltaTime * 60;
            
            // Reset line position when it goes off screen
            if (this.track.lines[i].y > this.canvas.height) {
                this.track.lines[i].y = -this.track.lineWidth;
            }
        }
        
        // Move obstacles
        for (let i = 0; i < this.track.obstacles.length; i++) {
            this.track.obstacles[i].y += (this.car.speed + this.speed) * deltaTime * 60;
        }
        
        // Move coins
        for (let i = 0; i < this.track.coins.length; i++) {
            this.track.coins[i].y += (this.car.speed + this.speed) * deltaTime * 60;
        }
        
        // Remove off-screen obstacles and coins
        this.track.obstacles = this.track.obstacles.filter(obstacle => obstacle.y < this.canvas.height);
        this.track.coins = this.track.coins.filter(coin => coin.y < this.canvas.height);
        
        // Generate new obstacles and coins if needed
        if (this.track.obstacles.length < 3 + this.level || this.track.coins.length < 5) {
            this.generateObstacles();
        }
    }
    
    checkCollisions() {
        // Check obstacle collisions
        for (let i = 0; i < this.track.obstacles.length; i++) {
            const obstacle = this.track.obstacles[i];
            
            if (this.car.x < obstacle.x + obstacle.width &&
                this.car.x + this.car.width > obstacle.x &&
                this.car.y < obstacle.y + obstacle.height &&
                this.car.y + this.car.height > obstacle.y) {
                
                // Collision detected
                this.handleObstacleCollision(obstacle);
                break;
            }
        }
        
        // Check coin collisions
        for (let i = this.track.coins.length - 1; i >= 0; i--) {
            const coin = this.track.coins[i];
            
            // Simple circle-rectangle collision
            const closestX = Math.max(this.car.x, Math.min(coin.x, this.car.x + this.car.width));
            const closestY = Math.max(this.car.y, Math.min(coin.y, this.car.y + this.car.height));
            
            const distance = Math.sqrt(
                Math.pow(coin.x - closestX, 2) + 
                Math.pow(coin.y - closestY, 2)
            );
            
            if (distance < coin.radius) {
                // Coin collected
                this.handleCoinCollection(i);
            }
        }
    }
    
    handleObstacleCollision(obstacle) {
        // Remove the obstacle
        this.track.obstacles = this.track.obstacles.filter(o => o !== obstacle);
        
        // Reduce lives
        this.lives--;
        
        // Update display
        this.updateInfoDisplay();
        
        // Play crash sound
        if (window.gameUtils) {
            window.gameUtils.playSound('error');
        }
        
        // Check if game over
        if (this.lives <= 0) {
            this.gameOver = true;
            this.showGameOver();
        } else {
            // Flash the screen red
            this.flashScreen('#ff0000');
        }
    }
    
    handleCoinCollection(coinIndex) {
        // Remove the coin
        this.track.coins.splice(coinIndex, 1);
        
        // Increase score
        this.score++;
        
        // Update display
        this.updateInfoDisplay();
        
        // Play success sound
        if (window.gameUtils) {
            window.gameUtils.playSound('success');
        }
    }
    
    levelUp() {
        // Only level up once per 10 points
        if (this.level === Math.floor(this.score / 10)) {
            return;
        }
        
        this.level = Math.floor(this.score / 10);
        this.speed += 0.5;
        
        // Update display
        this.updateInfoDisplay();
        
        // Flash the screen green
        this.flashScreen('#00ff00');
    }
    
    flashScreen(color) {
        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        flash.style.backgroundColor = color;
        this.container.appendChild(flash);
        
        setTimeout(() => {
            flash.remove();
        }, 200);
    }
    
    updateInfoDisplay() {
        const scoreElement = this.infoDisplay.querySelector('.racing-score span');
        const livesElement = this.infoDisplay.querySelector('.racing-lives span');
        const levelElement = this.infoDisplay.querySelector('.racing-level span');
        
        scoreElement.textContent = this.score;
        livesElement.textContent = this.lives;
        levelElement.textContent = this.level;
    }
    
    showGameOver() {
        this.gameRunning = false;
        
        // Draw game over screen
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '40px "Bubblegum Sans", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.font = '24px "Comic Neue", sans-serif';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(`Level Reached: ${this.level}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
        this.ctx.fillText('Press SPACE to play again', this.canvas.width / 2, this.canvas.height / 2 + 80);
        
        // Play game over sound
        if (window.gameUtils) {
            window.gameUtils.playSound('gameOver');
        }
        
        // Add restart button for touch devices
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Play Again';
        restartButton.className = 'game-button';
        restartButton.addEventListener('click', () => {
            this.startGame();
            restartButton.remove();
        });
        
        this.controls.innerHTML = '';
        this.controls.appendChild(restartButton);
        
        // Setup touch controls again
        this.setupTouchControls();
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#118ab2'; // Sky color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw road
        const roadLeft = (this.canvas.width - this.track.width) / 2;
        const roadRight = (this.canvas.width + this.track.width) / 2;
        
        this.ctx.fillStyle = this.track.roadColor;
        this.ctx.fillRect(roadLeft, 0, this.track.width, this.canvas.height);
        
        // Draw center line
        for (const line of this.track.lines) {
            this.ctx.fillStyle = this.track.lineColor;
            this.ctx.fillRect(
                this.canvas.width / 2 - this.track.lineWidth / 2,
                line.y,
                this.track.lineWidth,
                this.track.lineWidth
            );
        }
        
        // Draw obstacles
        for (const obstacle of this.track.obstacles) {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
        
        // Draw coins
        for (const coin of this.track.coins) {
            this.ctx.fillStyle = coin.color;
            this.ctx.beginPath();
            this.ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw coin inner circle
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(coin.x, coin.y, coin.radius / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw car
        this.ctx.fillStyle = this.car.color;
        this.ctx.fillRect(this.car.x, this.car.y, this.car.width, this.car.height);
        
        // Draw car details (windows, wheels)
        this.ctx.fillStyle = '#333';
        
        // Wheels
        this.ctx.fillRect(this.car.x - 5, this.car.y + 10, 5, 20);
        this.ctx.fillRect(this.car.x - 5, this.car.y + this.car.height - 30, 5, 20);
        this.ctx.fillRect(this.car.x + this.car.width, this.car.y + 10, 5, 20);
        this.ctx.fillRect(this.car.x + this.car.width, this.car.y + this.car.height - 30, 5, 20);
        
        // Windows
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(this.car.x + 5, this.car.y + 5, this.car.width - 10, 15);
        
        // If game is over, show game over screen
        if (this.gameOver) {
            this.showGameOver();
        }
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .racing-controls {
                display: flex;
                justify-content: center;
                margin-top: 15px;
            }
            
            .racing-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-family: 'Bubblegum Sans', cursive;
                font-size: 20px;
                color: #118ab2;
            }
            
            .game-button {
                background-color: #ff6b6b;
                color: white;
                border: none;
                border-radius: 30px;
                padding: 10px 20px;
                font-family: 'Comic Neue', sans-serif;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .game-button:hover {
                background-color: #ff5252;
            }
            
            .touch-controls {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(3, 1fr);
                gap: 5px;
                width: 150px;
                height: 150px;
            }
            
            .touch-btn {
                background-color: rgba(255, 255, 255, 0.7);
                border: 2px solid #118ab2;
                border-radius: 10px;
                font-size: 24px;
                color: #118ab2;
                cursor: pointer;
                user-select: none;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .touch-btn:active {
                background-color: #118ab2;
                color: white;
            }
            
            .up-btn {
                grid-column: 2;
                grid-row: 1;
            }
            
            .down-btn {
                grid-column: 2;
                grid-row: 3;
            }
            
            .left-btn {
                grid-column: 1;
                grid-row: 2;
            }
            
            .right-btn {
                grid-column: 3;
                grid-row: 2;
            }
            
            .screen-flash {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0.3;
                pointer-events: none;
                animation: flash 0.2s forwards;
            }
            
            @keyframes flash {
                0% { opacity: 0.3; }
                50% { opacity: 0.5; }
                100% { opacity: 0; }
            }
            
            @media (max-width: 600px) {
                .touch-controls {
                    width: 120px;
                    height: 120px;
                }
                
                .touch-btn {
                    font-size: 18px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the game when the script is loaded
function initRacingGame() {
    const game = new RacingGame('game-content');
}

// Initialize the game
initRacingGame();
