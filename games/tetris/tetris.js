// Tetris Game for Purvi Pinki Games
// A classic block-stacking puzzle game

class TetrisGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.container.innerHTML = '';
        
        // Game dimensions
        this.cols = 10;
        this.rows = 20;
        this.blockSize = 30;
        
        // Game state
        this.grid = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.dropInterval = 1000; // milliseconds
        this.dropCounter = 0;
        this.lastTime = 0;
        
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
        this.gameContainer.className = 'tetris-container';
        this.container.appendChild(this.gameContainer);
        
        // Create game info section
        this.infoSection = document.createElement('div');
        this.infoSection.className = 'tetris-info';
        
        // Score display
        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.className = 'tetris-score';
        this.scoreDisplay.innerHTML = `<h3>Score</h3><span>0</span>`;
        this.infoSection.appendChild(this.scoreDisplay);
        
        // Level display
        this.levelDisplay = document.createElement('div');
        this.levelDisplay.className = 'tetris-level';
        this.levelDisplay.innerHTML = `<h3>Level</h3><span>1</span>`;
        this.infoSection.appendChild(this.levelDisplay);
        
        // Lines display
        this.linesDisplay = document.createElement('div');
        this.linesDisplay.className = 'tetris-lines';
        this.linesDisplay.innerHTML = `<h3>Lines</h3><span>0</span>`;
        this.infoSection.appendChild(this.linesDisplay);
        
        // Next piece preview
        this.nextPieceDisplay = document.createElement('div');
        this.nextPieceDisplay.className = 'tetris-next-piece';
        this.nextPieceDisplay.innerHTML = `<h3>Next Piece</h3><div class="next-piece-container"></div>`;
        this.infoSection.appendChild(this.nextPieceDisplay);
        
        // Controls info
        this.controlsInfo = document.createElement('div');
        this.controlsInfo.className = 'tetris-controls-info';
        this.controlsInfo.innerHTML = `
            <h3>Controls</h3>
            <ul>
                <li>← → : Move</li>
                <li>↑ : Rotate</li>
                <li>↓ : Soft Drop</li>
                <li>Space : Hard Drop</li>
                <li>P : Pause</li>
            </ul>
        `;
        this.infoSection.appendChild(this.controlsInfo);
        
        // Game buttons
        this.gameButtons = document.createElement('div');
        this.gameButtons.className = 'tetris-buttons';
        
        // Start/Restart button
        this.startButton = document.createElement('button');
        this.startButton.className = 'tetris-button start-button';
        this.startButton.textContent = 'Start Game';
        this.startButton.addEventListener('click', () => this.startGame());
        this.gameButtons.appendChild(this.startButton);
        
        // Pause button
        this.pauseButton = document.createElement('button');
        this.pauseButton.className = 'tetris-button pause-button';
        this.pauseButton.textContent = 'Pause';
        this.pauseButton.addEventListener('click', () => this.togglePause());
        this.pauseButton.disabled = true;
        this.gameButtons.appendChild(this.pauseButton);
        
        this.infoSection.appendChild(this.gameButtons);
        
        // Add mobile controls
        this.createMobileControls();
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'tetris-canvas';
        this.canvas.width = this.cols * this.blockSize;
        this.canvas.height = this.rows * this.blockSize;
        this.ctx = this.canvas.getContext('2d');
        
        // Append elements to container
        this.gameContainer.appendChild(this.canvas);
        this.gameContainer.appendChild(this.infoSection);
    }
    
    createMobileControls() {
        this.mobileControls = document.createElement('div');
        this.mobileControls.className = 'tetris-mobile-controls';
        
        // Left button
        const leftBtn = document.createElement('button');
        leftBtn.className = 'mobile-control-btn left-btn';
        leftBtn.innerHTML = '◀';
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveLeft();
        });
        
        // Right button
        const rightBtn = document.createElement('button');
        rightBtn.className = 'mobile-control-btn right-btn';
        rightBtn.innerHTML = '▶';
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveRight();
        });
        
        // Rotate button
        const rotateBtn = document.createElement('button');
        rotateBtn.className = 'mobile-control-btn rotate-btn';
        rotateBtn.innerHTML = '↻';
        rotateBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.rotate();
        });
        
        // Down button
        const downBtn = document.createElement('button');
        downBtn.className = 'mobile-control-btn down-btn';
        downBtn.innerHTML = '▼';
        downBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveDown();
        });
        
        // Drop button
        const dropBtn = document.createElement('button');
        dropBtn.className = 'mobile-control-btn drop-btn';
        dropBtn.innerHTML = '⬇';
        dropBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.hardDrop();
        });
        
        this.mobileControls.appendChild(leftBtn);
        this.mobileControls.appendChild(rightBtn);
        this.mobileControls.appendChild(rotateBtn);
        this.mobileControls.appendChild(downBtn);
        this.mobileControls.appendChild(dropBtn);
        
        this.infoSection.appendChild(this.mobileControls);
    }
    
    init() {
        // Initialize grid
        this.createGrid();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Show start screen
        this.drawStartScreen();
    }
    
    createGrid() {
        this.grid = [];
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = 0;
            }
        }
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameOver || this.isPaused) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    break;
                case 'ArrowDown':
                    this.moveDown();
                    break;
                case 'ArrowUp':
                    this.rotate();
                    break;
                case ' ':
                    this.hardDrop();
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
        });
    }
    
    drawStartScreen() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw title
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '30px "Bubblegum Sans", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TETRIS', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        // Draw instructions
        this.ctx.font = '16px "Comic Neue", sans-serif';
        this.ctx.fillText('Press Start to play!', this.canvas.width / 2, this.canvas.height / 2);
        
        // Enable start button
        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
    }
    
    startGame() {
        // Reset game state
        this.createGrid();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.dropInterval = 1000;
        
        // Update display
        this.updateScoreDisplay();
        
        // Create first piece
        this.createNewPiece();
        
        // Enable pause button
        this.startButton.textContent = 'Restart';
        this.pauseButton.disabled = false;
        
        // Start game loop
        this.lastTime = 0;
        requestAnimationFrame(this.update.bind(this));
        
        // Play start sound
        if (window.gameUtils) {
            window.gameUtils.playSound('gameStart');
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseButton.textContent = this.isPaused ? 'Resume' : 'Pause';
        
        if (!this.isPaused) {
            // Resume game loop
            this.lastTime = 0;
            requestAnimationFrame(this.update.bind(this));
        } else {
            // Draw pause screen
            this.drawPauseScreen();
        }
        
        // Play click sound
        if (window.gameUtils) {
            window.gameUtils.playSound('click');
        }
    }
    
    drawPauseScreen() {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw pause text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '30px "Bubblegum Sans", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    update(time) {
        if (this.gameOver || this.isPaused) return;
        
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        // Update drop counter
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.moveDown();
        }
        
        // Draw game
        this.draw();
        
        // Continue game loop
        requestAnimationFrame(this.update.bind(this));
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw current piece
        this.drawPiece(this.currentPiece);
        
        // Draw next piece preview
        this.drawNextPiece();
    }
    
    drawGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col]) {
                    this.drawBlock(col, row, this.grid[row][col]);
                }
            }
        }
    }
    
    drawPiece(piece) {
        if (!piece) return;
        
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.drawBlock(piece.position.x + x, piece.position.y + y, piece.color);
                }
            });
        });
    }
    
    drawBlock(x, y, color) {
        // Draw block
        this.ctx.fillStyle = this.getBlockColor(color);
        this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
        
        // Draw block border
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
        
        // Draw block highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize / 4);
        this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize / 4, this.blockSize);
    }
    
    getBlockColor(colorId) {
        const colors = [
            '#000',      // Empty (should not be used)
            '#ff6b6b',   // Red - I piece
            '#ffd166',   // Yellow - O piece
            '#06d6a0',   // Green - S piece
            '#118ab2',   // Blue - Z piece
            '#073b4c',   // Navy - J piece
            '#7209b7',   // Purple - L piece
            '#f72585'    // Pink - T piece
        ];
        
        return colors[colorId];
    }
    
    drawNextPiece() {
        if (!this.nextPiece) return;
        
        const container = this.nextPieceDisplay.querySelector('.next-piece-container');
        container.innerHTML = '';
        
        // Create a small canvas for the next piece
        const canvas = document.createElement('canvas');
        const size = this.blockSize * 4;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, size, size);
        
        // Draw next piece
        const piece = this.nextPiece;
        const offsetX = (4 - piece.shape[0].length) / 2;
        const offsetY = (4 - piece.shape.length) / 2;
        
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    // Draw block
                    ctx.fillStyle = this.getBlockColor(piece.color);
                    ctx.fillRect(
                        (offsetX + x) * this.blockSize, 
                        (offsetY + y) * this.blockSize, 
                        this.blockSize, 
                        this.blockSize
                    );
                    
                    // Draw block border
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(
                        (offsetX + x) * this.blockSize, 
                        (offsetY + y) * this.blockSize, 
                        this.blockSize, 
                        this.blockSize
                    );
                    
                    // Draw block highlight
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.fillRect(
                        (offsetX + x) * this.blockSize, 
                        (offsetY + y) * this.blockSize, 
                        this.blockSize, 
                        this.blockSize / 4
                    );
                    ctx.fillRect(
                        (offsetX + x) * this.blockSize, 
                        (offsetY + y) * this.blockSize, 
                        this.blockSize / 4, 
                        this.blockSize
                    );
                }
            });
        });
        
        container.appendChild(canvas);
    }
    
    createNewPiece() {
        // Tetromino shapes
        const pieces = [
            {
                // I piece
                shape: [
                    [1, 1, 1, 1]
                ],
                color: 1
            },
            {
                // O piece
                shape: [
                    [2, 2],
                    [2, 2]
                ],
                color: 2
            },
            {
                // S piece
                shape: [
                    [0, 3, 3],
                    [3, 3, 0]
                ],
                color: 3
            },
            {
                // Z piece
                shape: [
                    [4, 4, 0],
                    [0, 4, 4]
                ],
                color: 4
            },
            {
                // J piece
                shape: [
                    [5, 0, 0],
                    [5, 5, 5]
                ],
                color: 5
            },
            {
                // L piece
                shape: [
                    [0, 0, 6],
                    [6, 6, 6]
                ],
                color: 6
            },
            {
                // T piece
                shape: [
                    [0, 7, 0],
                    [7, 7, 7]
                ],
                color: 7
            }
        ];
        
        // If there's no next piece, create one
        if (!this.nextPiece) {
            this.nextPiece = JSON.parse(JSON.stringify(pieces[Math.floor(Math.random() * pieces.length)]));
        }
        
        // Set current piece to next piece
        this.currentPiece = this.nextPiece;
        
        // Create new next piece
        this.nextPiece = JSON.parse(JSON.stringify(pieces[Math.floor(Math.random() * pieces.length)]));
        
        // Set initial position
        this.currentPiece.position = {
            x: Math.floor((this.cols - this.currentPiece.shape[0].length) / 2),
            y: 0
        };
        
        // Check if game over
        if (this.checkCollision()) {
            this.gameOver = true;
            this.drawGameOver();
            
            // Play game over sound
            if (window.gameUtils) {
                window.gameUtils.playSound('gameOver');
            }
        }
    }
    
    moveLeft() {
        if (this.gameOver || this.isPaused) return;
        
        this.currentPiece.position.x--;
        if (this.checkCollision()) {
            this.currentPiece.position.x++;
        }
    }
    
    moveRight() {
        if (this.gameOver || this.isPaused) return;
        
        this.currentPiece.position.x++;
        if (this.checkCollision()) {
            this.currentPiece.position.x--;
        }
    }
    
    moveDown() {
        if (this.gameOver || this.isPaused) return;
        
        this.currentPiece.position.y++;
        
        if (this.checkCollision()) {
            this.currentPiece.position.y--;
            this.lockPiece();
            this.clearLines();
            this.createNewPiece();
        }
        
        this.dropCounter = 0;
    }
    
    hardDrop() {
        if (this.gameOver || this.isPaused) return;
        
        while (!this.checkCollision()) {
            this.currentPiece.position.y++;
        }
        
        this.currentPiece.position.y--;
        this.lockPiece();
        this.clearLines();
        this.createNewPiece();
        
        this.dropCounter = 0;
    }
    
    rotate() {
        if (this.gameOver || this.isPaused) return;
        
        // Save original position and shape
        const originalPosition = { ...this.currentPiece.position };
        const originalShape = this.currentPiece.shape.map(row => [...row]);
        
        // Rotate the piece
        this.rotatePiece();
        
        // Check if rotation is valid
        if (this.checkCollision()) {
            // Try wall kicks
            const kicks = [
                { x: 1, y: 0 },   // Try right
                { x: -1, y: 0 },  // Try left
                { x: 0, y: -1 },  // Try up
                { x: 2, y: 0 },   // Try 2 right
                { x: -2, y: 0 },  // Try 2 left
            ];
            
            let validKickFound = false;
            
            for (const kick of kicks) {
                this.currentPiece.position.x += kick.x;
                this.currentPiece.position.y += kick.y;
                
                if (!this.checkCollision()) {
                    validKickFound = true;
                    break;
                }
                
                this.currentPiece.position.x -= kick.x;
                this.currentPiece.position.y -= kick.y;
            }
            
            // If no valid kick found, revert rotation
            if (!validKickFound) {
                this.currentPiece.position = originalPosition;
                this.currentPiece.shape = originalShape;
            }
        }
    }
    
    rotatePiece() {
        // Transpose the matrix
        const newShape = [];
        for (let i = 0; i < this.currentPiece.shape[0].length; i++) {
            newShape.push([]);
            for (let j = 0; j < this.currentPiece.shape.length; j++) {
                newShape[i].push(this.currentPiece.shape[j][i]);
            }
        }
        
        // Reverse each row to get a 90-degree clockwise rotation
        this.currentPiece.shape = newShape.map(row => row.reverse());
    }
    
    checkCollision() {
        if (!this.currentPiece) return false;
        
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x] !== 0) {
                    const newX = this.currentPiece.position.x + x;
                    const newY = this.currentPiece.position.y + y;
                    
                    // Check boundaries
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return true;
                    }
                    
                    // Check if position is already filled
                    if (newY >= 0 && this.grid[newY][newX] !== 0) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    lockPiece() {
        if (!this.currentPiece) return;
        
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x] !== 0) {
                    const newY = this.currentPiece.position.y + y;
                    
                    // Only lock if the piece is on the grid
                    if (newY >= 0) {
                        this.grid[newY][this.currentPiece.position.x + x] = this.currentPiece.color;
                    }
                }
            }
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = this.rows - 1; row >= 0; row--) {
            // Check if row is full
            if (this.grid[row].every(cell => cell !== 0)) {
                // Remove the row
                this.grid.splice(row, 1);
                // Add a new empty row at the top
                this.grid.unshift(Array(this.cols).fill(0));
                // Increment lines cleared
                linesCleared++;
                // Check the same row again (since we moved rows down)
                row++;
            }
        }
        
        if (linesCleared > 0) {
            // Update score
            this.updateScore(linesCleared);
            
            // Play line clear sound
            if (window.gameUtils) {
                window.gameUtils.playSound('tetrisLine');
            }
        }
    }
    
    updateScore(linesCleared) {
        // Score calculation based on lines cleared and level
        const linePoints = [0, 40, 100, 300, 1200]; // 0, 1, 2, 3, 4 lines
        this.score += linePoints[linesCleared] * this.level;
        
        // Update lines cleared
        this.lines += linesCleared;
        
        // Update level (every 10 lines)
        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            // Increase speed with level
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        }
        
        // Update display
        this.updateScoreDisplay();
    }
    
    updateScoreDisplay() {
        this.scoreDisplay.querySelector('span').textContent = this.score;
        this.levelDisplay.querySelector('span').textContent = this.level;
        this.linesDisplay.querySelector('span').textContent = this.lines;
    }
    
    drawGameOver() {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw game over text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '30px "Bubblegum Sans", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 30);
        
        // Draw score
        this.ctx.font = '20px "Comic Neue", sans-serif';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        this.ctx.fillText(`Level: ${this.level}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        
        // Update button text
        this.startButton.textContent = 'Play Again';
        this.pauseButton.disabled = true;
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tetris-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 20px;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .tetris-canvas {
                border: 2px solid #118ab2;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            .tetris-info {
                display: flex;
                flex-direction: column;
                gap: 15px;
                min-width: 200px;
            }
            
            .tetris-score, .tetris-level, .tetris-lines, .tetris-next-piece {
                background-color: #f0f0f0;
                border-radius: 10px;
                padding: 10px;
                text-align: center;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .tetris-score h3, .tetris-level h3, .tetris-lines h3, .tetris-next-piece h3 {
                margin: 0 0 5px 0;
                color: #118ab2;
                font-family: 'Bubblegum Sans', cursive;
            }
            
            .tetris-score span, .tetris-level span, .tetris-lines span {
                font-size: 24px;
                font-weight: bold;
                color: #ff6b6b;
                font-family: 'Comic Neue', sans-serif;
            }
            
            .next-piece-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 120px;
                background-color: #fff;
                border-radius: 5px;
                margin-top: 5px;
            }
            
            .tetris-controls-info {
                background-color: #f0f0f0;
                border-radius: 10px;
                padding: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .tetris-controls-info h3 {
                margin: 0 0 5px 0;
                color: #118ab2;
                font-family: 'Bubblegum Sans', cursive;
                text-align: center;
            }
            
            .tetris-controls-info ul {
                margin: 0;
                padding: 0 0 0 20px;
                font-family: 'Comic Neue', sans-serif;
            }
            
            .tetris-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
            
            .tetris-button {
                background-color: #ff6b6b;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 15px;
                font-family: 'Comic Neue', sans-serif;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .tetris-button:hover:not(:disabled) {
                background-color: #ff5252;
            }
            
            .tetris-button:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
            
            .tetris-mobile-controls {
                display: none;
                grid-template-columns: repeat(5, 1fr);
                gap: 5px;
                margin-top: 15px;
            }
            
            .mobile-control-btn {
                background-color: rgba(17, 138, 178, 0.7);
                color: white;
                border: none;
                border-radius: 10px;
                padding: 10px;
                font-size: 20px;
                cursor: pointer;
            }
            
            .mobile-control-btn:active {
                background-color: #118ab2;
            }
            
            @media (max-width: 768px) {
                .tetris-container {
                    flex-direction: column;
                    align-items: center;
                }
                
                .tetris-info {
                    width: 100%;
                }
                
                .tetris-controls-info {
                    display: none;
                }
                
                .tetris-mobile-controls {
                    display: grid;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the game when the script is loaded
function initTetrisGame() {
    const game = new TetrisGame('game-content');
}

// Initialize the game
initTetrisGame();
