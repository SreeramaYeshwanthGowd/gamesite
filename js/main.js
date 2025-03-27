// Main JavaScript for Purvi Pinki Games

// Audio management
let soundEnabled = true;
const audioFiles = {
    click: 'assets/sounds/click.mp3',
    success: 'assets/sounds/success.mp3',
    error: 'assets/sounds/error.mp3',
    gameStart: 'assets/sounds/game-start.mp3',
    gameOver: 'assets/sounds/game-over.mp3'
};

// DOM Elements
const gameMenu = document.getElementById('game-menu');
const gameContainer = document.getElementById('game-container');
const gameContent = document.getElementById('game-content');
const gameTitle = document.getElementById('game-title');
const backBtn = document.getElementById('back-btn');
const instructionsBtn = document.getElementById('instructions-btn');
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');
const helpBtn = document.getElementById('help-btn');
const instructionsModal = document.getElementById('instructions-modal');
const helpModal = document.getElementById('help-modal');
const modalGameTitle = document.getElementById('modal-game-title');
const instructionsContent = document.getElementById('instructions-content');
const closeBtns = document.querySelectorAll('.close-btn');

// Game data
const games = {
    pingpong: {
        title: 'Ping Pong',
        script: 'games/pingpong/pingpong.js',
        instructions: `
            <h3>How to Play Ping Pong</h3>
            <p>Move your paddle up and down to hit the ball back to your opponent.</p>
            <ul>
                <li>Use the <strong>Up and Down arrow keys</strong> to move your paddle</li>
                <li>Don't let the ball pass your paddle!</li>
                <li>Score points when your opponent misses the ball</li>
                <li>First player to reach 5 points wins!</li>
            </ul>
        `
    },
    tictactoe: {
        title: 'Tic Tac Toe',
        script: 'games/tictactoe/tictactoe.js',
        instructions: `
            <h3>How to Play Tic Tac Toe</h3>
            <p>Take turns placing X or O on the 3x3 grid.</p>
            <ul>
                <li>Click on any empty square to place your mark</li>
                <li>Get three of your marks in a row (horizontally, vertically, or diagonally) to win</li>
                <li>If all squares are filled and no one has three in a row, the game is a draw</li>
            </ul>
        `
    },
    dice: {
        title: 'Dice Game',
        script: 'games/dice/dice.js',
        instructions: `
            <h3>How to Play Dice Game</h3>
            <p>Roll the dice and try to get a higher number than the computer.</p>
            <ul>
                <li>Click the <strong>Roll Dice</strong> button to roll</li>
                <li>The player with the higher number wins the round</li>
                <li>Play multiple rounds to determine the overall winner</li>
            </ul>
        `
    },
    racing: {
        title: 'Racing Game',
        script: 'games/racing/racing.js',
        instructions: `
            <h3>How to Play Racing Game</h3>
            <p>Drive your car on the track, avoid obstacles, and reach the finish line!</p>
            <ul>
                <li>Use <strong>Arrow keys</strong> to control your car</li>
                <li>Left/Right: Steer the car</li>
                <li>Up: Accelerate</li>
                <li>Down: Brake</li>
                <li>Avoid hitting obstacles or going off the track</li>
                <li>Reach the finish line as quickly as possible</li>
            </ul>
        `
    },
    ludo: {
        title: 'Ludo',
        script: 'games/ludo/ludo.js',
        instructions: `
            <h3>How to Play Ludo</h3>
            <p>Move your tokens from start to finish based on dice rolls.</p>
            <ul>
                <li>Roll the dice by clicking the <strong>Roll</strong> button</li>
                <li>You need to roll a 6 to move a token out of the home base</li>
                <li>Click on a token to move it the number of spaces shown on the dice</li>
                <li>If you land on an opponent's token, it goes back to their home base</li>
                <li>Get all four of your tokens to the finish area to win</li>
            </ul>
        `
    },
    tetris: {
        title: 'Tetris',
        script: 'games/tetris/tetris.js',
        instructions: `
            <h3>How to Play Tetris</h3>
            <p>Arrange falling blocks to create complete horizontal lines.</p>
            <ul>
                <li>Use <strong>Left/Right Arrow keys</strong> to move the falling piece</li>
                <li>Use <strong>Up Arrow key</strong> to rotate the piece</li>
                <li>Use <strong>Down Arrow key</strong> to make the piece fall faster</li>
                <li>Use <strong>Space bar</strong> to drop the piece instantly</li>
                <li>Complete horizontal lines to clear them and score points</li>
                <li>The game ends when the blocks reach the top of the screen</li>
            </ul>
        `
    },
    drawing: {
        title: 'Drawing Game',
        script: 'games/drawing/drawing.js',
        instructions: `
            <h3>How to Use the Drawing Game</h3>
            <p>Express your creativity with this simple drawing tool!</p>
            <ul>
                <li>Click and drag your mouse to draw</li>
                <li>Use the color palette to change colors</li>
                <li>Adjust the brush size with the slider</li>
                <li>Use the eraser tool to remove parts of your drawing</li>
                <li>Click the Clear button to start over</li>
            </ul>
        `
    },
    snakeladder: {
        title: 'Snake & Ladder',
        script: 'games/snakeladder/snakeladder.js',
        instructions: `
            <h3>How to Play Snake & Ladder</h3>
            <p>Roll the dice and move your token to reach the finish!</p>
            <ul>
                <li>Click the <strong>Roll Dice</strong> button to roll and move</li>
                <li>If you land at the bottom of a ladder, you climb up to the top</li>
                <li>If you land on the head of a snake, you slide down to its tail</li>
                <li>First player to reach the final square (100) wins!</li>
            </ul>
        `
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    // Set up game tiles
    const gameTiles = document.querySelectorAll('.game-tile');
    gameTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const gameId = tile.getAttribute('data-game');
            loadGame(gameId);
            playSound('gameStart');
        });
    });

    // Back button
    backBtn.addEventListener('click', () => {
        showMenu();
        playSound('click');
    });

    // Instructions button
    instructionsBtn.addEventListener('click', () => {
        showInstructions();
        playSound('click');
    });

    // Help button
    helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
        playSound('click');
    });

    // Sound toggle
    soundToggle.addEventListener('click', toggleSound);

    // Close buttons for modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            instructionsModal.classList.add('hidden');
            helpModal.classList.add('hidden');
            playSound('click');
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === instructionsModal) {
            instructionsModal.classList.add('hidden');
        }
        if (e.target === helpModal) {
            helpModal.classList.add('hidden');
        }
    });

    // Create assets directory for placeholder images
    createPlaceholderAssets();
}

// Game Loading Functions
function loadGame(gameId) {
    if (!games[gameId]) {
        console.error(`Game ${gameId} not found!`);
        return;
    }

    // Update UI
    gameMenu.classList.remove('active-section');
    gameMenu.classList.add('hidden-section');
    gameContainer.classList.remove('hidden-section');
    gameContainer.classList.add('active-section');
    gameTitle.textContent = games[gameId].title;
    
    // Clear previous game content
    gameContent.innerHTML = '';
    
    // Load game script
    const script = document.createElement('script');
    script.src = games[gameId].script;
    script.id = 'current-game-script';
    
    // Remove any previously loaded game script
    const oldScript = document.getElementById('current-game-script');
    if (oldScript) {
        oldScript.remove();
    }
    
    document.body.appendChild(script);
    
    // Store current game ID
    gameContainer.setAttribute('data-current-game', gameId);
}

function showMenu() {
    // Update UI
    gameContainer.classList.remove('active-section');
    gameContainer.classList.add('hidden-section');
    gameMenu.classList.remove('hidden-section');
    gameMenu.classList.add('active-section');
    
    // Clear game content
    gameContent.innerHTML = '';
    
    // Remove current game script
    const oldScript = document.getElementById('current-game-script');
    if (oldScript) {
        oldScript.remove();
    }
}

function showInstructions() {
    const gameId = gameContainer.getAttribute('data-current-game');
    if (!gameId || !games[gameId]) {
        return;
    }
    
    modalGameTitle.textContent = games[gameId].title;
    instructionsContent.innerHTML = games[gameId].instructions;
    instructionsModal.classList.remove('hidden');
}

// Sound Functions
function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        soundIcon.src = 'assets/sound-on.png';
        soundIcon.alt = 'Sound On';
    } else {
        soundIcon.src = 'assets/sound-off.png';
        soundIcon.alt = 'Sound Off';
    }
    playSound('click');
}

function playSound(soundName) {
    if (!soundEnabled || !audioFiles[soundName]) {
        return;
    }
    
    // This is a placeholder - actual audio implementation will be in audio.js
    console.log(`Playing sound: ${soundName}`);
}

// Helper function to create placeholder assets (for development)
function createPlaceholderAssets() {
    // This function would normally create placeholder images
    // In a real implementation, these would be actual image files
    console.log('Placeholder assets would be created here');
}

// Expose functions for game modules
window.gameUtils = {
    playSound,
    showMenu,
    showInstructions
};
