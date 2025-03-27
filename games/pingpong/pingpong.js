// PingPong Game for Purvi Pinki Games
// A simple 2D table tennis style game

class PingPong {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        // Game dimensions
        this.width = 800;
        this.height = 500;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Game elements
        this.paddleWidth = 15;
        this.paddleHeight = 100;
        this.ballSize = 15;
        
        // Game state
        this.playerScore = 0;
        this.aiScore = 0;
        this.gameRunning = false;
        this.winningScore = 5;
        
        // Initialize game
        this.init();
    }
    
    init() {
        // Create game elements
        this.createGameElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Create UI elements
        this.createUI();
        
        // Start screen
        this.showStartScreen();
    }
    
    createGameElements() {
        // Player paddle
        this.playerPaddle = {
            x: 50,
            y: this.height / 2 - this.paddleHeight / 2,
            width: this.paddleWidth,
            height: this.paddleHeight,
            speed: 10,
            color: '#ff6b6b'
        };
        
        // AI paddle
        this.aiPaddle = {
            x: this.width - 50 - this.paddleWidth,
            y: this.height / 2 - this.paddleHeight / 2,
            width: this.paddleWidth,
            height: this.paddleHeight,
            speed: 5,
            color: '#118ab2'
        };
        
        // Ball
        this.resetBall();
    }
    
    resetBall() {
        this.ball = {
            x: this.width / 2,
            y: this.height / 2,
            size: this.ballSize,
            speedX: 5 * (Math.random() > 0.5 ? 1 : -1),
            speedY: 3 * (Math.random() > 0.5 ? 1 : -1),
            color: '#ffd166'
        };
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            if (e.key === 'ArrowUp') {
                this.movePlayerPaddle(-1);
            } else if (e.key === 'ArrowDown') {
                this.movePlayerPaddle(1);
            }
        });
        
        // Make canvas responsive
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const containerWidth = this.container.clientWidth;
        const scale = Math.min(1, containerWidth / this.width);
        
        this.canvas.style.width = `${this.width * scale}px`;
        this.canvas.style.height = `${this.height * scale}px`;
    }
    
    createUI() {
        // Score display
        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.className = 'ping-pong-score';
        this.scoreDisplay.innerHTML = `<span>Player: 0</span><span>AI: 0</span>`;
        this.container.appendChild(this.scoreDisplay);
        
        // Controls
        this.controls = document.createElement('div');
        this.controls.className = 'ping-pong-controls';
        this.container.appendChild(this.controls);
    }
    
    showStartScreen() {
        this.ctx.fillStyle = '#f0f9ff';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#118ab2';
        this.ctx.font = '30px "Bubblegum Sans", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Ping Pong', this.width / 2, this.height / 2 - 50);
        
        this.ctx.font = '20px "Comic Neue", sans-serif';
        this.ctx.fillText('Press SPACE to start', this.width / 2, this.height / 2 + 20);
        this.ctx.fillText('Use UP and DOWN arrow keys to move your paddle', this.width / 2, this.height / 2 + 60);
        
        // Start game on space key
        const spaceHandler = (e) => {
            if (e.key === ' ' || e.code === 'Space') {
                this.startGame();
                document.removeEventListener('keydown', spaceHandler);
            }
        };
        
        document.addEventListener('keydown', spaceHandler);
        
        // Also add a start button for touch devices
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.className = 'game-button';
        startButton.addEventListener('click', () => {
            this.startGame();
            document.removeEventListener('keydown', spaceHandler);
            startButton.remove();
        });
        
        this.controls.innerHTML = '';
        this.controls.appendChild(startButton);
    }
    
    startGame() {
        this.gameRunning = true;
        this.playerScore = 0;
        this.aiScore = 0;
        this.updateScore();
        this.resetBall();
        this.gameLoop();
        
        // Play start sound
        if (window.gameUtils) {
            window.gameUtils.playSound('gameStart');
        }
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Move ball
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        
        // Ball collision with top and bottom walls
        if (this.ball.y <= 0 || this.ball.y >= this.height - this.ball.size) {
            this.ball.speedY = -this.ball.speedY;
            
            // Play bounce sound
            if (window.gameUtils) {
                window.gameUtils.playSound('bounce');
            }
        }
        
        // Ball collision with paddles
        if (this.checkPaddleCollision(this.playerPaddle) || 
            this.checkPaddleCollision(this.aiPaddle)) {
            
            // Reverse ball direction
            this.ball.speedX = -this.ball.speedX;
            
            // Slightly increase speed
            this.ball.speedX *= 1.05;
            
            // Vary Y speed based on where the ball hits the paddle
            if (this.checkPaddleCollision(this.playerPaddle)) {
                const hitPosition = (this.ball.y - this.playerPaddle.y) / this.playerPaddle.height;
                this.ball.speedY = (hitPosition - 0.5) * 10;
            } else {
                const hitPosition = (this.ball.y - this.aiPaddle.y) / this.aiPaddle.height;
                this.ball.speedY = (hitPosition - 0.5) * 10;
            }
            
            // Play bounce sound
            if (window.gameUtils) {
                window.gameUtils.playSound('bounce');
            }
        }
        
        // Ball out of bounds
        if (this.ball.x <= 0) {
            // AI scores
            this.aiScore++;
            this.updateScore();
            this.checkGameOver();
            this.resetBall();
            
            // Play error sound
            if (window.gameUtils) {
                window.gameUtils.playSound('error');
            }
        } else if (this.ball.x >= this.width) {
            // Player scores
            this.playerScore++;
            this.updateScore();
            this.checkGameOver();
            this.resetBall();
            
            // Play success sound
            if (window.gameUtils) {
                window.gameUtils.playSound('success');
            }
        }
        
        // AI paddle movement
        this.moveAIPaddle();
    }
    
    checkPaddleCollision(paddle) {
        return (
            this.ball.x < paddle.x + paddle.width &&
            this.ball.x + this.ball.size > paddle.x &&
            this.ball.y < paddle.y + paddle.height &&
            this.ball.y + this.ball.size > paddle.y
        );
    }
    
    movePlayerPaddle(direction) {
        const newY = this.playerPaddle.y + (direction * this.playerPaddle.speed);
        
        // Keep paddle within bounds
        if (newY >= 0 && newY <= this.height - this.playerPaddle.height) {
            this.playerPaddle.y = newY;
        }
    }
    
    moveAIPaddle() {
        // Simple AI: follow the ball with a slight delay
        const paddleCenter = this.aiPaddle.y + (this.aiPaddle.height / 2);
        const ballCenter = this.ball.y + (this.ball.size / 2);
        
        // Only move if the ball is moving towards the AI
        if (this.ball.speedX > 0) {
            if (paddleCenter < ballCenter - 10) {
                this.aiPaddle.y += this.aiPaddle.speed;
            } else if (paddleCenter > ballCenter + 10) {
                this.aiPaddle.y -= this.aiPaddle.speed;
            }
            
            // Keep paddle within bounds
            if (this.aiPaddle.y < 0) {
                this.aiPaddle.y = 0;
            } else if (this.aiPaddle.y > this.height - this.aiPaddle.height) {
                this.aiPaddle.y = this.height - this.aiPaddle.height;
            }
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#f0f9ff';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw center line
        this.ctx.strokeStyle = '#ccc';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw paddles
        this.ctx.fillStyle = this.playerPaddle.color;
        this.ctx.fillRect(
            this.playerPaddle.x, 
            this.playerPaddle.y, 
            this.playerPaddle.width, 
            this.playerPaddle.height
        );
        
        this.ctx.fillStyle = this.aiPaddle.color;
        this.ctx.fillRect(
            this.aiPaddle.x, 
            this.aiPaddle.y, 
            this.aiPaddle.width, 
            this.aiPaddle.height
        );
        
        // Draw ball
        this.ctx.fillStyle = this.ball.color;
        this.ctx.beginPath();
        this.ctx.arc(
            this.ball.x + this.ball.size / 2, 
            this.ball.y + this.ball.size / 2, 
            this.ball.size / 2, 
            0, 
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    updateScore() {
        this.scoreDisplay.innerHTML = `<span>Player: ${this.playerScore}</span><span>AI: ${this.aiScore}</span>`;
    }
    
    checkGameOver() {
        if (this.playerScore >= this.winningScore || this.aiScore >= this.winningScore) {
            this.gameRunning = false;
            this.showGameOver();
            
            // Play game over sound
            if (window.gameUtils) {
                window.gameUtils.playSound('gameOver');
            }
        }
    }
    
    showGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '40px "Bubblegum Sans", cursive';
        this.ctx.textAlign = 'center';
        
        const winner = this.playerScore > this.aiScore ? 'Player' : 'AI';
        this.ctx.fillText(`${winner} Wins!`, this.width / 2, this.height / 2 - 50);
        
        this.ctx.font = '24px "Comic Neue", sans-serif';
        this.ctx.fillText(`Final Score: ${this.playerScore} - ${this.aiScore}`, this.width / 2, this.height / 2 + 10);
        this.ctx.fillText('Press SPACE to play again', this.width / 2, this.height / 2 + 60);
        
        // Restart game on space key
        const spaceHandler = (e) => {
            if (e.key === ' ' || e.code === 'Space') {
                this.startGame();
                document.removeEventListener('keydown', spaceHandler);
            }
        };
        
        document.addEventListener('keydown', spaceHandler);
        
        // Also add a restart button for touch devices
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Play Again';
        restartButton.className = 'game-button';
        restartButton.addEventListener('click', () => {
            this.startGame();
            document.removeEventListener('keydown', spaceHandler);
            restartButton.remove();
        });
        
        this.controls.innerHTML = '';
        this.controls.appendChild(restartButton);
    }
}

// Initialize the game when the script is loaded
function initPingPong() {
    // Add game-specific CSS
    const style = document.createElement('style');
    style.textContent = `
        .ping-pong-score {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-family: 'Bubblegum Sans', cursive;
            font-size: 24px;
            color: #118ab2;
        }
        
        .ping-pong-controls {
            display: flex;
            justify-content: center;
            margin-top: 15px;
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
    `;
    document.head.appendChild(style);
    
    // Create and start the game
    const game = new PingPong('game-content');
}

// Initialize the game
initPingPong();
