// Ludo Game for Purvi Pinki Games
// This game implements a simplified version of the traditional Ludo board game

// Game variables
let gameBoard;
let players = [];
let currentPlayer = 0;
let diceValue = 1;
let gameStarted = false;
let gameOver = false;
let animating = false;
let selectedToken = null;

// Board configuration
const boardSize = 11; // 11x11 grid
const cellSize = 40;
const tokenSize = 30;
const playerColors = ['#ff6b6b', '#06d6a0', '#118ab2', '#ffd166'];
const playerNames = ['Red', 'Green', 'Blue', 'Yellow'];
const numPlayers = 4;
const tokensPerPlayer = 4;

// Path configuration
const homeBases = [
    { row: 9, col: 1 }, // Red home base (bottom left)
    { row: 1, col: 1 }, // Green home base (top left)
    { row: 1, col: 9 }, // Blue home base (top right)
    { row: 9, col: 9 }  // Yellow home base (bottom right)
];

// Initialize the game
function initLudoGame() {
    // Create game container
    const gameContainer = document.getElementById('game-content');
    gameContainer.innerHTML = `
        <div class="ludo-container">
            <div class="game-controls">
                <button id="start-game" class="game-button">Start Game</button>
                <button id="roll-dice" class="game-button" disabled>Roll Dice</button>
                <button id="reset-game" class="game-button" disabled>Reset Game</button>
            </div>
            <div class="game-info">
                <div id="current-player">Select number of players and click Start</div>
                <div id="dice-display" class="dice-display">
                    <div class="die">
                        <div class="dot center"></div>
                    </div>
                </div>
            </div>
            <div class="player-selector">
                <label>Number of Players:</label>
                <select id="player-count">
                    <option value="2">2 Players</option>
                    <option value="3">3 Players</option>
                    <option value="4" selected>4 Players</option>
                </select>
            </div>
            <canvas id="ludo-canvas" width="440" height="440"></canvas>
            <div id="game-message" class="game-message"></div>
        </div>
    `;

    // Add game-specific styles
    const style = document.createElement('style');
    style.textContent = `
        .ludo-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
        #ludo-canvas {
            background-color: #f0f0f0;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            margin: 1rem 0;
        }
        .game-controls {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
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
        .game-button:hover {
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
            margin-bottom: 1rem;
        }
        #current-player {
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
        .game-message {
            margin-top: 1rem;
            font-size: 1.2rem;
            font-weight: bold;
            height: 1.5rem;
            text-align: center;
            color: #ff6b6b;
        }
    `;
    document.head.appendChild(style);

    // Get canvas and context
    const canvas = document.getElementById('ludo-canvas');
    const ctx = canvas.getContext('2d');

    // Add event listeners
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('roll-dice').addEventListener('click', rollDice);
    document.getElementById('reset-game').addEventListener('click', resetGame);
    canvas.addEventListener('click', handleCanvasClick);

    // Initialize game
    resetGame();
}

// Reset the game
function resetGame() {
    // Reset game state
    gameStarted = false;
    gameOver = false;
    currentPlayer = 0;
    diceValue = 1;
    selectedToken = null;
    
    // Get selected player count
    const playerCount = parseInt(document.getElementById('player-count').value);
    
    // Initialize players
    players = [];
    for (let i = 0; i < playerCount; i++) {
        const tokens = [];
        for (let j = 0; j < tokensPerPlayer; j++) {
            tokens.push({
                id: j,
                position: -1, // -1 means in home base
                completed: false,
                x: 0,
                y: 0
            });
        }
        
        players.push({
            id: i,
            name: playerNames[i],
            color: playerColors[i],
            tokens: tokens,
            startPosition: i * 13, // Starting position on the main track
            homeBase: homeBases[i],
            tokensCompleted: 0
        });
    }
    
    // Initialize game board
    initializeBoard();
    
    // Update UI
    document.getElementById('start-game').disabled = false;
    document.getElementById('roll-dice').disabled = true;
    document.getElementById('reset-game').disabled = true;
    document.getElementById('player-count').disabled = false;
    document.getElementById('current-player').textContent = 'Select number of players and click Start';
    document.getElementById('game-message').textContent = '';
    
    // Update dice display
    updateDiceDisplay(1);
    
    // Render board
    renderBoard();
}

// Initialize the game board
function initializeBoard() {
    gameBoard = [];
    
    // Create empty board
    for (let row = 0; row < boardSize; row++) {
        gameBoard[row] = [];
        for (let col = 0; col < boardSize; col++) {
            gameBoard[row][col] = {
                type: 'empty',
                color: '#ffffff'
            };
        }
    }
    
    // Set up home bases
    for (let i = 0; i < players.length; i++) {
        const homeBase = players[i].homeBase;
        const color = players[i].color;
        
        // 2x2 home base
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 2; c++) {
                gameBoard[homeBase.row + r][homeBase.col + c] = {
                    type: 'home',
                    color: color,
                    playerId: i
                };
            }
        }
    }
    
    // Set up main track
    const trackPositions = [
        // Bottom row (left to right)
        {row: 10, col: 5}, {row: 9, col: 5}, {row: 8, col: 5}, {row: 7, col: 5}, {row: 6, col: 5},
        // Left column (bottom to top)
        {row: 5, col: 4}, {row: 5, col: 3}, {row: 5, col: 2}, {row: 5, col: 1}, {row: 5, col: 0},
        // Top row (left to right)
        {row: 4, col: 0}, {row: 4, col: 1}, {row: 4, col: 2}, {row: 4, col: 3}, {row: 4, col: 4},
        // Right column (top to bottom)
        {row: 5, col: 5}, {row: 5, col: 6}, {row: 5, col: 7}, {row: 5, col: 8}, {row: 5, col: 9}, {row: 5, col: 10},
        // Bottom row (right to left)
        {row: 6, col: 10}, {row: 7, col: 10}, {row: 8, col: 10}, {row: 9, col: 10}, {row: 10, col: 10},
        // Right column (bottom to top)
        {row: 10, col: 9}, {row: 10, col: 8}, {row: 10, col: 7}, {row: 10, col: 6}
    ];
    
    // Set track cells
    for (let pos of trackPositions) {
        gameBoard[pos.row][pos.col] = {
            type: 'track',
            color: '#e0e0e0'
        };
    }
    
    // Set up home paths for each player
    const homePaths = [
        // Red home path (bottom to top)
        [{row: 9, col: 5}, {row: 8, col: 5}, {row: 7, col: 5}, {row: 6, col: 5}, {row: 5, col: 5}],
        // Green home path (left to right)
        [{row: 5, col: 1}, {row: 5, col: 2}, {row: 5, col: 3}, {row: 5, col: 4}, {row: 5, col: 5}],
        // Blue home path (top to bottom)
        [{row: 1, col: 5}, {row: 2, col: 5}, {row: 3, col: 5}, {row: 4, col: 5}, {row: 5, col: 5}],
        // Yellow home path (right to left)
        [{row: 5, col: 9}, {row: 5, col: 8}, {row: 5, col: 7}, {row: 5, col: 6}, {row: 5, col: 5}]
    ];
    
    // Set home path cells
    for (let i = 0; i < players.length; i++) {
        const color = players[i].color;
        for (let pos of homePaths[i]) {
            gameBoard[pos.row][pos.col] = {
                type: 'home-path',
                color: color,
                playerId: i
            };
        }
    }
    
    // Set center (finish) cell
    gameBoard[5][5] = {
        type: 'finish',
        color: '#ffffff'
    };
    
    // Position tokens in home bases
    for (let i = 0; i < players.length; i++) {
        const homeBase = players[i].homeBase;
        const tokens = players[i].tokens;
        
        // Position tokens in 2x2 grid within home base
        const positions = [
            {row: homeBase.row, col: homeBase.col},
            {row: homeBase.row, col: homeBase.col + 1},
            {row: homeBase.row + 1, col: homeBase.col},
            {row: homeBase.row + 1, col: homeBase.col + 1}
        ];
        
        for (let j = 0; j < tokens.length; j++) {
            const pos = positions[j];
            tokens[j].x = pos.col * cellSize + cellSize / 2;
            tokens[j].y = pos.row * cellSize + cellSize / 2;
        }
    }
}

// Start the game
function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    currentPlayer = 0;
    
    // Update UI
    document.getElementById('start-game').disabled = true;
    document.getElementById('roll-dice').disabled = false;
    document.getElementById('reset-game').disabled = false;
    document.getElementById('player-count').disabled = true;
    updatePlayerDisplay();
    
    // Play start sound
    window.gameUtils.playSound('gameStart');
}

// Roll the dice
function rollDice() {
    if (!gameStarted || gameOver || animating) return;
    
    // Disable roll button during animation
    document.getElementById('roll-dice').disabled = true;
    
    // Play dice roll sound
    window.gameUtils.playSound('diceRoll');
    
    // Animate dice rolling
    animating = true;
    let animationFrames = 10;
    let currentFrame = 0;
    
    const animateRoll = () => {
        // Generate random value for animation
        const value = Math.floor(Math.random() * 6) + 1;
        updateDiceDisplay(value);
        
        currentFrame++;
        
        if (currentFrame < animationFrames) {
            // Continue animation
            setTimeout(animateRoll, 100);
        } else {
            // Final roll
            diceValue = Math.floor(Math.random() * 6) + 1;
            updateDiceDisplay(diceValue);
            
            // Check if player can move
            const canMove = checkPlayerCanMove();
            
            if (canMove) {
                // Player can move, wait for token selection
                document.getElementById('game-message').textContent = 'Select a token to move';
                selectedToken = null;
            } else {
                // Player cannot move, next player's turn
                document.getElementById('game-message').textContent = 'No valid moves. Next player\'s turn.';
                setTimeout(() => {
                    nextPlayer();
                    document.getElementById('roll-dice').disabled = false;
                    animating = false;
                }, 1500);
            }
        }
    };
    
    // Start animation
    animateRoll();
}

// Update dice display
function updateDiceDisplay(value) {
    const dieElement = document.querySelector('.die');
    
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

// Check if current player can move any token
function checkPlayerCanMove() {
    const player = players[currentPlayer];
    
    // If rolled 6, check if any token can leave home
    if (diceValue === 6) {
        for (let token of player.tokens) {
            if (token.position === -1 && !token.completed) {
                return true;
            }
        }
    }
    
    // Check if any token on the board can move
    for (let token of player.tokens) {
        if (token.position !== -1 && !token.completed) {
            // Check if token can move without going past finish
            const newPosition = (token.position + diceValue) % 52;
            return true;
        }
    }
    
    return false;
}

// Handle canvas click
function handleCanvasClick(event) {
    if (!gameStarted || gameOver || animating || diceValue === 0) return;
    
    // Get click position relative to canvas
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if a token was clicked
    const player = players[currentPlayer];
    for (let i = 0; i < player.tokens.length; i++) {
        const token = player.tokens[i];
        const dx = token.x - x;
        const dy = token.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= tokenSize / 2) {
            // Token clicked
            if (canMoveToken(token)) {
                selectedToken = token;
                moveToken();
                return;
            } else {
                document.getElementById('game-message').textContent = 'Cannot move this token. Select another.';
            }
        }
    }
}

// Check if a token can be moved
function canMoveToken(token) {
    // If token is in home base, can only move out with a 6
    if (token.position === -1) {
        return diceValue === 6;
    }
    
    // If token is already on the board, it can move
    return !token.completed;
}

// Move the selected token
function moveToken() {
    if (!selectedToken) return;
    
    animating = true;
    
    const player = players[currentPlayer];
    
    // If token is in home base, move to starting position
    if (selectedToken.position === -1) {
        selectedToken.position = player.startPosition;
        
        // Calculate new position
        const row = Math.floor(selectedToken.position / boardSize);
        const col = selectedToken.position % boardSize;
        
        // Animate token movement
        animateTokenMovement(selectedToken, col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, () => {
            checkCapture();
            checkWinCondition();
            
            // If rolled 6, player gets another turn
            if (diceValue === 6) {
                document.getElementById('game-message').textContent = 'Rolled a 6! Roll again.';
                document.getElementById('roll-dice').disabled = false;
            } else {
                nextPlayer();
                document.getElementById('roll-dice').disabled = false;
            }
            
            animating = false;
        });
        
        return;
    }
    
    // Move token on the board
    const newPosition = (selectedToken.position + diceValue) % 52;
    selectedToken.position = newPosition;
    
    // Calculate new position
    const row = Math.floor(newPosition / boardSize);
    const col = newPosition % boardSize;
    
    // Animate token movement
    animateTokenMovement(selectedToken, col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, () => {
        checkCapture();
        checkWinCondition();
        
        // If rolled 6, player gets another turn
        if (diceValue === 6) {
            document.getElementById('game-message').textContent = 'Rolled a 6! Roll again.';
            document.getElementById('roll-dice').disabled = false;
        } else {
            nextPlayer();
            document.getElementById('roll-dice').disabled = false;
        }
        
        animating = false;
    });
}

// Animate token movement
function animateTokenMovement(token, targetX, targetY, callback) {
    const startX = token.x;
    const startY = token.y;
    const dx = targetX - startX;
    const dy = targetY - startY;
    const duration = 500; // ms
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smoother animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        token.x = startX + dx * easeProgress;
        token.y = startY + dy * easeProgress;
        
        renderBoard();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            if (callback) callback();
        }
    }
    
    animate();
}

// Check if token captures another token
function checkCapture() {
    const player = players[currentPlayer];
    const token = selectedToken;
    
    // Check for other players' tokens at the same position
    for (let i = 0; i < players.length; i++) {
        if (i === currentPlayer) continue;
        
        const otherPlayer = players[i];
        for (let otherToken of otherPlayer.tokens) {
            if (otherToken.position === token.position && otherToken.position !== -1) {
                // Capture token (send back to home base)
                otherToken.position = -1;
                
                // Calculate home base position
                const homeBase = otherPlayer.homeBase;
                const tokenId = otherToken.id;
                const positions = [
                    {row: homeBase.row, col: homeBase.col},
                    {row: homeBase.row, col: homeBase.col + 1},
                    {row: homeBase.row + 1, col: homeBase.col},
                    {row: homeBase.row + 1, col: homeBase.col + 1}
                ];
                const pos = positions[tokenId];
                
                // Animate token movement back to home
                animateTokenMovement(otherToken, pos.col * cellSize + cellSize / 2, pos.row * cellSize + cellSize / 2, null);
                
                // Play capture sound
                window.gameUtils.playSound('error');
                
                document.getElementById('game-message').textContent = `${player.name} captured ${otherPlayer.name}'s token!`;
            }
        }
    }
}

// Check if player has won
function checkWinCondition() {
    const player = players[currentPlayer];
    
    // Check if all tokens have completed
    let allCompleted = true;
    for (let token of player.tokens) {
        if (!token.completed) {
            allCompleted = false;
            break;
        }
    }
    
    if (allCompleted) {
        gameOver = true;
        document.getElementById('game-message').textContent = `${player.name} wins the game!`;
        document.getElementById('roll-dice').disabled = true;
        window.gameUtils.playSound('success');
    }
}

// Move to next player
function nextPlayer() {
    do {
        currentPlayer = (currentPlayer + 1) % players.length;
    } while (isPlayerFinished(currentPlayer));
    
    updatePlayerDisplay();
}

// Check if player has finished the game
function isPlayerFinished(playerIndex) {
    const player = players[playerIndex];
    
    for (let token of player.tokens) {
        if (!token.completed) {
            return false;
        }
    }
    
    return true;
}

// Update current player display
function updatePlayerDisplay() {
    const player = players[currentPlayer];
    document.getElementById('current-player').textContent = `${player.name}'s Turn`;
    document.getElementById('current-player').style.color = player.color;
}

// Render the game board
function renderBoard() {
    const canvas = document.getElementById('ludo-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw board cells
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = gameBoard[row][col];
            
            // Draw cell
            ctx.fillStyle = cell.color;
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            
            // Draw cell border
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 1;
            ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            
            // Draw special markings for finish cell
            if (cell.type === 'finish') {
                ctx.fillStyle = '#ff6b6b';
                ctx.beginPath();
                ctx.moveTo(col * cellSize + cellSize / 2, row * cellSize);
                ctx.lineTo(col * cellSize + cellSize, row * cellSize + cellSize / 2);
                ctx.lineTo(col * cellSize + cellSize / 2, row * cellSize + cellSize);
                ctx.lineTo(col * cellSize, row * cellSize + cellSize / 2);
                ctx.closePath();
                ctx.fill();
                
                ctx.fillStyle = '#06d6a0';
                ctx.beginPath();
                ctx.moveTo(col * cellSize + cellSize / 2, row * cellSize);
                ctx.lineTo(col * cellSize + cellSize, row * cellSize + cellSize / 2);
                ctx.lineTo(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
                ctx.closePath();
                ctx.fill();
                
                ctx.fillStyle = '#118ab2';
                ctx.beginPath();
                ctx.moveTo(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
                ctx.lineTo(col * cellSize + cellSize, row * cellSize + cellSize / 2);
                ctx.lineTo(col * cellSize + cellSize / 2, row * cellSize + cellSize);
                ctx.closePath();
                ctx.fill();
                
                ctx.fillStyle = '#ffd166';
                ctx.beginPath();
                ctx.moveTo(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2);
                ctx.lineTo(col * cellSize + cellSize / 2, row * cellSize + cellSize);
                ctx.lineTo(col * cellSize, row * cellSize + cellSize / 2);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
    
    // Draw tokens
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        
        for (let token of player.tokens) {
            // Draw token
            ctx.fillStyle = player.color;
            ctx.beginPath();
            ctx.arc(token.x, token.y, tokenSize / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw token border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw token number
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(token.id + 1, token.x, token.y);
        }
    }
    
    // Highlight selected token
    if (selectedToken) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(selectedToken.x, selectedToken.y, tokenSize / 2 + 3, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Initialize the game when loaded
initLudoGame();
