// Snake and Ladder Game for Purvi Pinki Games
// A classic board game where players move based on dice rolls

class SnakeLadderGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.container.innerHTML = '';
        
        // Game constants
        this.boardSize = 10; // 10x10 grid
        this.cellSize = 60;
        this.playerColors = ['#ff6b6b', '#06d6a0', '#118ab2', '#ffd166'];
        this.playerNames = ['Red', 'Green', 'Blue', 'Yellow'];
        
        // Game state
        this.players = [];
        this.currentPlayer = 0;
        this.diceValue = 1;
        this.gameStarted = false;
        this.gameOver = false;
        this.animating = false;
        
        // Snakes and ladders
        this.snakes = [
            { from: 99, to: 78 },
            { from: 95, to: 75 },
            { from: 92, to: 73 },
            { from: 87, to: 24 },
            { from: 64, to: 60 },
            { from: 62, to: 19 },
            { from: 54, to: 34 },
            { from: 17, to: 7 }
        ];
        
        this.ladders = [
            { from: 4, to: 14 },
            { from: 9, to: 31 },
            { from: 20, to: 38 },
            { from: 28, to: 84 },
            { from: 40, to: 59 },
            { from: 51, to: 67 },
            { from: 63, to: 81 },
            { from: 71, to: 91 }
        ];
        
        // Create game elements
        this.createGameElements();
        
        // Initialize the game
        this.init();
        
        // Add game-specific CSS
        this.addStyles();
    }
    
    createGameElements() {
        // Create game container
        this.gameContainer = document.createElement('div');
        this.gameContainer.className = 'snakeladder-container';
        this.container.appendChild(this.gameContainer);
        
        // Create board container
        this.boardContainer = document.createElement('div');
        this.boardContainer.className = 'snakeladder-board-container';
        this.gameContainer.appendChild(this.boardContainer);
        
        // Create canvas for the board
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.boardSize * this.cellSize;
        this.canvas.height = this.boardSize * this.cellSize;
        this.canvas.className = 'snakeladder-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.boardContainer.appendChild(this.canvas);
        
        // Create player tokens container (overlay on canvas)
        this.tokensContainer = document.createElement('div');
        this.tokensContainer.className = 'snakeladder-tokens';
        this.tokensContainer.style.width = `${this.canvas.width}px`;
        this.tokensContainer.style.height = `${this.canvas.height}px`;
        this.boardContainer.appendChild(this.tokensContainer);
        
        // Create game controls
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.className = 'snakeladder-controls';
        this.gameContainer.appendChild(this.controlsContainer);
        
        // Player selection
        this.playerSelector = document.createElement('div');
        this.playerSelector.className = 'player-selector';
        this.playerSelector.innerHTML = `
            <label>Number of Players:</label>
            <select id="player-count">
                <option value="2">2 Players</option>
                <option value="3">3 Players</option>
                <option value="4" selected>4 Players</option>
            </select>
        `;
        this.controlsContainer.appendChild(this.playerSelector);
        
        // Game buttons
        this.gameButtons = document.createElement('div');
        this.gameButtons.className = 'game-buttons';
        
        // Start button
        this.startButton = document.createElement('button');
        this.startButton.className = 'game-button';
        this.startButton.textContent = 'Start Game';
        this.startButton.addEventListener('click', () => this.startGame());
        this.gameButtons.appendChild(this.startButton);
        
        // Roll dice button
        this.rollButton = document.createElement('button');
        this.rollButton.className = 'game-button';
        this.rollButton.textContent = 'Roll Dice';
        this.rollButton.disabled = true;
        this.rollButton.addEventListener('click', () => this.rollDice());
        this.gameButtons.appendChild(this.rollButton);
        
        // Reset button
        this.resetButton = document.createElement('button');
        this.resetButton.className = 'game-button';
        this.resetButton.textContent = 'Reset Game';
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.gameButtons.appendChild(this.resetButton);
        
        this.controlsContainer.appendChild(this.gameButtons);
        
        // Game info
        this.gameInfo = document.createElement('div');
        this.gameInfo.className = 'game-info';
        
        // Current player display
        this.playerDisplay = document.createElement('div');
        this.playerDisplay.className = 'current-player';
        this.playerDisplay.textContent = 'Select players and click Start';
        this.gameInfo.appendChild(this.playerDisplay);
        
        // Dice display
        this.diceDisplay = document.createElement('div');
        this.diceDisplay.className = 'dice-display';
        this.diceDisplay.innerHTML = `
            <div class="die">
                <div class="dot center"></div>
            </div>
        `;
        this.gameInfo.appendChild(this.diceDisplay);
        
        this.controlsContainer.appendChild(this.gameInfo);
        
        // Game message
        this.messageDisplay = document.createElement('div');
        this.messageDisplay.className = 'game-message';
        this.controlsContainer.appendChild(this.messageDisplay);
    }
    
    init() {
        // Draw the board
        this.drawBoard();
        
        // Initialize players
        this.resetGame();
    }
    
    resetGame() {
        // Clear any existing tokens
        this.tokensContainer.innerHTML = '';
        
        // Reset game state
        this.gameStarted = false;
        this.gameOver = false;
        this.currentPlayer = 0;
        this.diceValue = 1;
        
        // Get selected player count
        const playerCount = parseInt(document.getElementById('player-count').value);
        
        // Initialize players
        this.players = [];
        for (let i = 0; i < playerCount; i++) {
            this.players.push({
                id: i,
                name: this.playerNames[i],
                color: this.playerColors[i],
                position: 0, // Start at position 0 (off board)
                token: null
            });
            
            // Create player token
            const token = document.createElement('div');
            token.className = 'player-token';
            token.style.backgroundColor = this.playerColors[i];
            token.textContent = (i + 1).toString();
            token.style.display = 'none'; // Hide until game starts
            this.tokensContainer.appendChild(token);
            
            this.players[i].token = token;
        }
        
        // Update UI
        this.playerDisplay.textContent = 'Select players and click Start';
        this.playerDisplay.style.color = '#000';
        this.messageDisplay.textContent = '';
        this.startButton.disabled = false;
        this.rollButton.disabled = true;
        document.getElementById('player-count').disabled = false;
        
        // Update dice display
        this.updateDiceDisplay(1);
    }
    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.gameOver = false;
        this.currentPlayer = 0;
        
        // Update UI
        this.startButton.disabled = true;
        this.rollButton.disabled = false;
        document.getElementById('player-count').disabled = true;
        this.updatePlayerDisplay();
        
        // Play start sound
        if (window.gameUtils) {
            window.gameUtils.playSound('gameStart');
        }
    }
    
    rollDice() {
        if (!this.gameStarted || this.gameOver || this.animating) return;
        
        // Disable roll button during animation
        this.rollButton.disabled = true;
        
        // Play dice roll sound
        if (window.gameUtils) {
            window.gameUtils.playSound('diceRoll');
        }
        
        // Animate dice rolling
        this.animating = true;
        let animationFrames = 10;
        let currentFrame = 0;
        
        const animateRoll = () => {
            // Generate random value for animation
            const value = Math.floor(Math.random() * 6) + 1;
            this.updateDiceDisplay(value);
            
            currentFrame++;
            
            if (currentFrame < animationFrames) {
                // Continue animation
                setTimeout(animateRoll, 100);
            } else {
                // Final roll
                this.diceValue = Math.floor(Math.random() * 6) + 1;
                this.updateDiceDisplay(this.diceValue);
                
                // Move player
                this.movePlayer();
            }
        };
        
        // Start animation
        animateRoll();
    }
    
    movePlayer() {
        const player = this.players[this.currentPlayer];
        const oldPosition = player.position;
        let newPosition = oldPosition + this.diceValue;
        
        // Check if player is entering the board
        if (oldPosition === 0 && this.diceValue === 6) {
            // Player enters the board at position 1
            newPosition = 1;
            this.messageDisplay.textContent = `${player.name} enters the board!`;
            
            // Show token
            player.token.style.display = 'block';
        } 
        // Check if player is already on the board
        else if (oldPosition > 0) {
            // Check if player would go beyond the finish
            if (newPosition > 100) {
                newPosition = oldPosition;
                this.messageDisplay.textContent = `${player.name} needs exact roll to finish!`;
                this.animating = false;
                this.rollButton.disabled = false;
                
                // Next player's turn
                this.nextPlayer();
                return;
            }
            
            this.messageDisplay.textContent = `${player.name} moves from ${oldPosition} to ${newPosition}`;
        } 
        // Player needs a 6 to enter
        else {
            this.messageDisplay.textContent = `${player.name} needs a 6 to enter the board!`;
            this.animating = false;
            this.rollButton.disabled = false;
            
            // Next player's turn
            this.nextPlayer();
            return;
        }
        
        // Update player position
        player.position = newPosition;
        
        // Animate token movement
        this.animateTokenMovement(player, oldPosition, newPosition, () => {
            // Check for snakes and ladders
            this.checkSnakesAndLadders();
        });
    }
    
    animateTokenMovement(player, fromPosition, toPosition, callback) {
        // Get coordinates for the positions
        const fromCoord = this.getPositionCoordinates(fromPosition);
        const toCoord = this.getPositionCoordinates(toPosition);
        
        // Set initial position if entering the board
        if (fromPosition === 0) {
            player.token.style.left = `${toCoord.x}px`;
            player.token.style.top = `${toCoord.y}px`;
            
            // Call callback immediately
            callback();
            return;
        }
        
        // Animate movement
        const duration = 500; // ms
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smoother animation
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            // Calculate current position
            const x = fromCoord.x + (toCoord.x - fromCoord.x) * easeProgress;
            const y = fromCoord.y + (toCoord.y - fromCoord.y) * easeProgress;
            
            // Update token position
            player.token.style.left = `${x}px`;
            player.token.style.top = `${y}px`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                if (callback) callback();
            }
        };
        
        animate();
    }
    
    checkSnakesAndLadders() {
        const player = this.players[this.currentPlayer];
        const position = player.position;
        
        // Check for snakes
        const snake = this.snakes.find(s => s.from === position);
        if (snake) {
            this.messageDisplay.textContent = `Oops! ${player.name} hit a snake and slides down to ${snake.to}!`;
            
            // Play snake sound
            if (window.gameUtils) {
                window.gameUtils.playSound('error');
            }
            
            // Animate sliding down the snake
            this.animateTokenMovement(player, position, snake.to, () => {
                player.position = snake.to;
                this.checkWinCondition();
            });
            
            return;
        }
        
        // Check for ladders
        const ladder = this.ladders.find(l => l.from === position);
        if (ladder) {
            this.messageDisplay.textContent = `Yay! ${player.name} climbs a ladder to ${ladder.to}!`;
            
            // Play ladder sound
            if (window.gameUtils) {
                window.gameUtils.playSound('success');
            }
            
            // Animate climbing the ladder
            this.animateTokenMovement(player, position, ladder.to, () => {
                player.position = ladder.to;
                this.checkWinCondition();
            });
            
            return;
        }
        
        // No snake or ladder, check win condition
        this.checkWinCondition();
    }
    
    checkWinCondition() {
        const player = this.players[this.currentPlayer];
        
        // Check if player reached position 100
        if (player.position === 100) {
            this.gameOver = true;
            this.messageDisplay.textContent = `${player.name} wins the game!`;
            this.rollButton.disabled = true;
            
            // Play win sound
            if (window.gameUtils) {
                window.gameUtils.playSound('gameWin');
            }
        } else {
            // Next player's turn
            this.nextPlayer();
        }
        
        this.animating = false;
        if (!this.gameOver) {
            this.rollButton.disabled = false;
        }
    }
    
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.updatePlayerDisplay();
    }
    
    updatePlayerDisplay() {
        const player = this.players[this.currentPlayer];
        this.playerDisplay.textContent = `${player.name}'s Turn`;
        this.playerDisplay.style.color = player.color;
    }
    
    updateDiceDisplay(value) {
        const dieElement = this.diceDisplay.querySelector('.die');
        
        // Clear previous dots
        dieElement.innerHTML = '';
        
        // Add dots based on value
        switch (value) {
            case 1:
                dieElement.innerHTML = '<div class="dot center"></div>';
                break;
            case 2:
                dieElement.innerHTML = '<div class="dot tl"></div><div class="dot br"></div>';
                break;
            case 3:
                dieElement.innerHTML = '<div class="dot tl"></div><div class="dot center"></div><div class="dot br"></div>';
                break;
            case 4:
                dieElement.innerHTML = '<div class="dot tl"></div><div class="dot tr"></div><div class="dot bl"></div><div class="dot br"></div>';
                break;
            case 5:
                dieElement.innerHTML = '<div class="dot tl"></div><div class="dot tr"></div><div class="dot center"></div><div class="dot bl"></div><div class="dot br"></div>';
                break;
            case 6:
                dieElement.innerHTML = '<div class="dot tl"></div><div class="dot tr"></div><div class="dot ml"></div><div class="dot mr"></div><div class="dot bl"></div><div class="dot br"></div>';
                break;
        }
    }
    
    drawBoard() {
        // Clear canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cells
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                // Calculate cell number (1-100)
                let cellNumber;
                if (row % 2 === 0) {
                    // Even rows go left to right
                    cellNumber = (this.boardSize - row - 1) * this.boardSize + col + 1;
                } else {
                    // Odd rows go right to left
                    cellNumber = (this.boardSize - row) * this.boardSize - col;
                }
                
                // Draw cell
                this.drawCell(row, col, cellNumber);
            }
        }
        
        // Draw snakes
        this.snakes.forEach(snake => {
            this.drawSnake(snake.from, snake.to);
        });
        
        // Draw ladders
        this.ladders.forEach(ladder => {
            this.drawLadder(ladder.from, ladder.to);
        });
    }
    
    drawCell(row, col, number) {
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        
        // Alternate cell colors
        if ((row + col) % 2 === 0) {
            this.ctx.fillStyle = '#ffffff';
        } else {
            this.ctx.fillStyle = '#e6e6e6';
        }
        
        // Special colors for start and finish
        if (number === 1) {
            this.ctx.fillStyle = '#06d6a0'; // Green for start
        } else if (number === 100) {
            this.ctx.fillStyle = '#ff6b6b'; // Red for finish
        }
        
        // Draw cell background
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        
        // Draw cell border
        this.ctx.strokeStyle = '#cccccc';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
        
        // Draw cell number
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(number.toString(), x + this.cellSize / 2, y + this.cellSize / 2);
    }
    
    drawSnake(from, to) {
        // Get coordinates for start and end positions
        const fromCoord = this.getPositionCoordinates(from);
        const toCoord = this.getPositionCoordinates(to);
        
        // Draw snake
        this.ctx.beginPath();
        this.ctx.moveTo(fromCoord.x, fromCoord.y);
        
        // Create a curved path for the snake
        const controlPoint1 = {
            x: fromCoord.x + (toCoord.x - fromCoord.x) / 3 + 30,
            y: fromCoord.y + (toCoord.y - fromCoord.y) / 3
        };
        
        const controlPoint2 = {
            x: fromCoord.x + 2 * (toCoord.x - fromCoord.x) / 3 - 30,
            y: fromCoord.y + 2 * (toCoord.y - fromCoord.y) / 3
        };
        
        this.ctx.bezierCurveTo(
            controlPoint1.x, controlPoint1.y,
            controlPoint2.x, controlPoint2.y,
            toCoord.x, toCoord.y
        );
        
        // Style the snake
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = '#ff6b6b'; // Red for snakes
        this.ctx.stroke();
        
        // Draw snake head
        this.ctx.beginPath();
        this.ctx.arc(fromCoord.x, fromCoord.y, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fill();
        
        // Draw snake eyes
        this.ctx.beginPath();
        this.ctx.arc(fromCoord.x - 3, fromCoord.y - 3, 2, 0, Math.PI * 2);
        this.ctx.arc(fromCoord.x + 3, fromCoord.y - 3, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
    }
    
    drawLadder(from, to) {
        // Get coordinates for start and end positions
        const fromCoord = this.getPositionCoordinates(from);
        const toCoord = this.getPositionCoordinates(to);
        
        // Calculate ladder width
        const ladderWidth = 15;
        
        // Calculate angle of the ladder
        const angle = Math.atan2(toCoord.y - fromCoord.y, toCoord.x - fromCoord.x);
        
        // Calculate perpendicular offset for ladder sides
        const perpX = Math.sin(angle) * (ladderWidth / 2);
        const perpY = -Math.cos(angle) * (ladderWidth / 2);
        
        // Draw ladder sides
        this.ctx.beginPath();
        
        // First side
        this.ctx.moveTo(fromCoord.x + perpX, fromCoord.y + perpY);
        this.ctx.lineTo(toCoord.x + perpX, toCoord.y + perpY);
        
        // Second side
        this.ctx.moveTo(fromCoord.x - perpX, fromCoord.y - perpY);
        this.ctx.lineTo(toCoord.x - perpX, toCoord.y - perpY);
        
        // Style the ladder sides
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#8B4513'; // Brown for ladder
        this.ctx.stroke();
        
        // Draw ladder rungs
        const distance = Math.sqrt(
            Math.pow(toCoord.x - fromCoord.x, 2) + 
            Math.pow(toCoord.y - fromCoord.y, 2)
        );
        
        const numRungs = Math.floor(distance / 30);
        const stepX = (toCoord.x - fromCoord.x) / (numRungs + 1);
        const stepY = (toCoord.y - fromCoord.y) / (numRungs + 1);
        
        for (let i = 1; i <= numRungs; i++) {
            const rungX = fromCoord.x + stepX * i;
            const rungY = fromCoord.y + stepY * i;
            
            this.ctx.beginPath();
            this.ctx.moveTo(rungX + perpX, rungY + perpY);
            this.ctx.lineTo(rungX - perpX, rungY - perpY);
            
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#8B4513';
            this.ctx.stroke();
        }
    }
    
    getPositionCoordinates(position) {
        // Position 0 is off the board (waiting to enter)
        if (position === 0) {
            return { x: -this.cellSize, y: this.canvas.height - this.cellSize / 2 };
        }
        
        // Calculate row and column for the position
        const row = Math.floor((position - 1) / this.boardSize);
        let col;
        
        if (row % 2 === 0) {
            // Even rows go left to right
            col = (position - 1) % this.boardSize;
        } else {
            // Odd rows go right to left
            col = this.boardSize - 1 - ((position - 1) % this.boardSize);
        }
        
        // Convert to board coordinates (bottom to top)
        const boardRow = this.boardSize - 1 - row;
        
        // Calculate pixel coordinates (center of cell)
        // Add small random offset for each player to avoid overlap
        return {
            x: col * this.cellSize + this.cellSize / 2,
            y: boardRow * this.cellSize + this.cellSize / 2
        };
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .snakeladder-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .snakeladder-board-container {
                position: relative;
                margin: 1rem 0;
            }
            
            .snakeladder-canvas {
                display: block;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .snakeladder-tokens {
                position: absolute;
                top: 0;
                left: 0;
                pointer-events: none;
            }
            
            .player-token {
                position: absolute;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                transform: translate(-50%, -50%);
                z-index: 10;
            }
            
            .snakeladder-controls {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                width: 100%;
            }
            
            .player-selector {
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            #player-count {
                padding: 0.3rem;
                border-radius: 5px;
                border: 1px solid #ccc;
                font-family: 'Comic Neue', sans-serif;
                font-size: 1rem;
            }
            
            .game-buttons {
                display: flex;
                gap: 1rem;
            }
            
            .game-button {
                background-color: #ffd166;
                border: none;
                border-radius: 30px;
                padding: 0.5rem 1.5rem;
                font-family: 'Comic Neue', sans-serif;
                font-weight: bold;
                font-size: 1rem;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .game-button:hover:not(:disabled) {
                background-color: #ffbd00;
            }
            
            .game-button:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
            }
            
            .game-info {
                display: flex;
                align-items: center;
                gap: 2rem;
                margin: 1rem 0;
            }
            
            .current-player {
                font-size: 1.2rem;
                font-weight: bold;
            }
            
            .dice-display {
                display: flex;
                justify-content: center;
            }
            
            .die {
                width: 50px;
                height: 50px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                display: grid;
                grid-template-areas: 
                    "tl . tr"
                    ". c ."
                    "bl . br";
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr 1fr;
                padding: 5px;
            }
            
            .dot {
                width: 8px;
                height: 8px;
                background-color: #333;
                border-radius: 50%;
                align-self: center;
                justify-self: center;
            }
            
            .dot.tl { grid-area: tl; }
            .dot.tr { grid-area: tr; }
            .dot.center { grid-area: c; }
            .dot.bl { grid-area: bl; }
            .dot.br { grid-area: br; }
            .dot.ml { grid-area: ml; }
            .dot.mr { grid-area: mr; }
            
            .game-message {
                margin-top: 1rem;
                font-size: 1.2rem;
                font-weight: bold;
                height: 1.5rem;
                text-align: center;
                color: #ff6b6b;
            }
            
            @media (max-width: 768px) {
                .snakeladder-canvas {
                    max-width: 100%;
                    height: auto;
                }
                
                .game-buttons {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .game-info {
                    flex-direction: column;
                    gap: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the game when the script is loaded
function initSnakeLadderGame() {
    const game = new SnakeLadderGame('game-content');
}

// Initialize the game
initSnakeLadderGame();
