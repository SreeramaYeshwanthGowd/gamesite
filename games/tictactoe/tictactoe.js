// TicTacToe Game for Purvi Pinki Games
// A classic 3x3 grid game where players take turns placing X or O

class TicTacToe {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.container.innerHTML = '';
        
        // Game state
        this.currentPlayer = 'X';
        this.aiPlayer = 'O';
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.gameActive = false;
        this.gameMode = 'ai'; // 'ai' or '2player'
        
        // Create game elements
        this.createGameElements();
    }
    
    createGameElements() {
        // Create game container
        this.gameContainer = document.createElement('div');
        this.gameContainer.className = 'tictactoe-container';
        this.container.appendChild(this.gameContainer);
        
        // Create mode selection
        this.createModeSelection();
        
        // Create status display
        this.statusDisplay = document.createElement('div');
        this.statusDisplay.className = 'tictactoe-status';
        this.statusDisplay.textContent = 'Select game mode to start';
        this.gameContainer.appendChild(this.statusDisplay);
        
        // Create game board
        this.createBoard();
        
        // Create restart button
        this.restartButton = document.createElement('button');
        this.restartButton.className = 'game-button';
        this.restartButton.textContent = 'Restart Game';
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.gameContainer.appendChild(this.restartButton);
        
        // Add game-specific CSS
        this.addStyles();
    }
    
    createModeSelection() {
        const modeContainer = document.createElement('div');
        modeContainer.className = 'tictactoe-mode-selection';
        
        const singlePlayerBtn = document.createElement('button');
        singlePlayerBtn.className = 'mode-button active';
        singlePlayerBtn.textContent = 'vs Computer';
        singlePlayerBtn.addEventListener('click', () => {
            this.gameMode = 'ai';
            singlePlayerBtn.classList.add('active');
            twoPlayerBtn.classList.remove('active');
            this.restartGame();
        });
        
        const twoPlayerBtn = document.createElement('button');
        twoPlayerBtn.className = 'mode-button';
        twoPlayerBtn.textContent = 'Two Players';
        twoPlayerBtn.addEventListener('click', () => {
            this.gameMode = '2player';
            twoPlayerBtn.classList.add('active');
            singlePlayerBtn.classList.remove('active');
            this.restartGame();
        });
        
        modeContainer.appendChild(singlePlayerBtn);
        modeContainer.appendChild(twoPlayerBtn);
        this.gameContainer.appendChild(modeContainer);
    }
    
    createBoard() {
        this.boardElement = document.createElement('div');
        this.boardElement.className = 'tictactoe-board';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'tictactoe-cell';
            cell.setAttribute('data-cell-index', i);
            cell.addEventListener('click', () => this.handleCellClick(i));
            this.boardElement.appendChild(cell);
        }
        
        this.gameContainer.appendChild(this.boardElement);
    }
    
    startGame() {
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.updateStatusDisplay();
        this.updateBoard();
        
        // Play start sound
        if (window.gameUtils) {
            window.gameUtils.playSound('gameStart');
        }
    }
    
    restartGame() {
        this.startGame();
    }
    
    handleCellClick(cellIndex) {
        const cell = this.board[cellIndex];
        
        if (cell !== '' || !this.gameActive) {
            return;
        }
        
        // Update the board
        this.board[cellIndex] = this.currentPlayer;
        this.updateBoard();
        
        // Play sound
        if (window.gameUtils) {
            window.gameUtils.playSound('click');
        }
        
        // Check for win or draw
        if (this.checkWin()) {
            this.handleGameWon();
            return;
        }
        
        if (this.checkDraw()) {
            this.handleGameDraw();
            return;
        }
        
        // Switch player
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatusDisplay();
        
        // If playing against AI and it's AI's turn
        if (this.gameMode === 'ai' && this.currentPlayer === this.aiPlayer) {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }
    
    makeAIMove() {
        if (!this.gameActive) return;
        
        // Simple AI: first try to win, then block, then take center, then take a random move
        let cellIndex = this.findBestMove();
        
        // Make the move
        this.board[cellIndex] = this.aiPlayer;
        this.updateBoard();
        
        // Play sound
        if (window.gameUtils) {
            window.gameUtils.playSound('click');
        }
        
        // Check for win or draw
        if (this.checkWin()) {
            this.handleGameWon();
            return;
        }
        
        if (this.checkDraw()) {
            this.handleGameDraw();
            return;
        }
        
        // Switch back to player
        this.currentPlayer = 'X';
        this.updateStatusDisplay();
    }
    
    findBestMove() {
        // Check if AI can win
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = this.aiPlayer;
                if (this.checkWin()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Check if player can win and block
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                if (this.checkWin()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Take center if available
        if (this.board[4] === '') {
            return 4;
        }
        
        // Take a corner if available
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available space
        const availableMoves = this.board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] !== '' && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                
                // Highlight winning cells
                this.highlightWinningCells(pattern);
                
                return true;
            }
        }
        
        return false;
    }
    
    checkDraw() {
        return !this.board.includes('');
    }
    
    handleGameWon() {
        this.gameActive = false;
        this.statusDisplay.textContent = `${this.currentPlayer} Wins!`;
        
        // Play success sound
        if (window.gameUtils) {
            window.gameUtils.playSound('success');
        }
    }
    
    handleGameDraw() {
        this.gameActive = false;
        this.statusDisplay.textContent = `Game ended in a Draw!`;
        
        // Play game over sound
        if (window.gameUtils) {
            window.gameUtils.playSound('gameOver');
        }
    }
    
    updateStatusDisplay() {
        if (this.gameActive) {
            this.statusDisplay.textContent = `${this.currentPlayer}'s turn`;
        }
    }
    
    updateBoard() {
        const cells = this.boardElement.querySelectorAll('.tictactoe-cell');
        cells.forEach((cell, index) => {
            cell.textContent = this.board[index];
            cell.className = 'tictactoe-cell';
            if (this.board[index] === 'X') {
                cell.classList.add('x');
            } else if (this.board[index] === 'O') {
                cell.classList.add('o');
            }
        });
    }
    
    highlightWinningCells(pattern) {
        const cells = this.boardElement.querySelectorAll('.tictactoe-cell');
        pattern.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tictactoe-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                max-width: 400px;
                margin: 0 auto;
            }
            
            .tictactoe-mode-selection {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }
            
            .mode-button {
                background-color: #f0f0f0;
                border: 2px solid #ccc;
                border-radius: 20px;
                padding: 8px 16px;
                font-family: 'Comic Neue', sans-serif;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .mode-button.active {
                background-color: #118ab2;
                color: white;
                border-color: #118ab2;
            }
            
            .tictactoe-status {
                font-family: 'Bubblegum Sans', cursive;
                font-size: 24px;
                color: #118ab2;
                text-align: center;
                height: 40px;
            }
            
            .tictactoe-board {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(3, 1fr);
                gap: 10px;
                width: 300px;
                height: 300px;
            }
            
            .tictactoe-cell {
                background-color: #f9f9f9;
                border-radius: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 60px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .tictactoe-cell:hover {
                background-color: #f0f0f0;
                transform: scale(1.05);
            }
            
            .tictactoe-cell.x {
                color: #ff6b6b;
            }
            
            .tictactoe-cell.o {
                color: #118ab2;
            }
            
            .tictactoe-cell.winning-cell {
                background-color: #ffd166;
                animation: pulse 1s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
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
            
            @media (max-width: 400px) {
                .tictactoe-board {
                    width: 250px;
                    height: 250px;
                }
                
                .tictactoe-cell {
                    font-size: 50px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the game when the script is loaded
function initTicTacToe() {
    const game = new TicTacToe('game-content');
    game.startGame();
}

// Initialize the game
initTicTacToe();
