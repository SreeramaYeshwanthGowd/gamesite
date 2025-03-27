// Dice Game for Purvi Pinki Games
// A simple dice rolling game where player competes against the computer

class DiceGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.container.innerHTML = '';
        
        // Game state
        this.playerScore = 0;
        this.computerScore = 0;
        this.roundsPlayed = 0;
        this.totalRounds = 5; // Best of 5 rounds
        this.diceCount = 1; // Start with 1 die
        this.gameActive = false;
        
        // Create game elements
        this.createGameElements();
    }
    
    createGameElements() {
        // Create game container
        this.gameContainer = document.createElement('div');
        this.gameContainer.className = 'dice-game-container';
        this.container.appendChild(this.gameContainer);
        
        // Create dice selection
        this.createDiceSelection();
        
        // Create score display
        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.className = 'dice-score';
        this.scoreDisplay.innerHTML = `
            <div class="player-score">
                <h3>You</h3>
                <span>0</span>
            </div>
            <div class="vs">VS</div>
            <div class="computer-score">
                <h3>Computer</h3>
                <span>0</span>
            </div>
        `;
        this.gameContainer.appendChild(this.scoreDisplay);
        
        // Create dice display area
        this.diceArea = document.createElement('div');
        this.diceArea.className = 'dice-area';
        
        // Player dice container
        this.playerDiceContainer = document.createElement('div');
        this.playerDiceContainer.className = 'dice-container player-dice';
        this.playerDiceContainer.innerHTML = '<h3>Your Dice</h3><div class="dice-holder"></div>';
        this.diceArea.appendChild(this.playerDiceContainer);
        
        // Computer dice container
        this.computerDiceContainer = document.createElement('div');
        this.computerDiceContainer.className = 'dice-container computer-dice';
        this.computerDiceContainer.innerHTML = '<h3>Computer\'s Dice</h3><div class="dice-holder"></div>';
        this.diceArea.appendChild(this.computerDiceContainer);
        
        this.gameContainer.appendChild(this.diceArea);
        
        // Create result display
        this.resultDisplay = document.createElement('div');
        this.resultDisplay.className = 'dice-result';
        this.resultDisplay.textContent = 'Roll the dice to start!';
        this.gameContainer.appendChild(this.resultDisplay);
        
        // Create roll button
        this.rollButton = document.createElement('button');
        this.rollButton.className = 'game-button roll-button';
        this.rollButton.textContent = 'Roll Dice';
        this.rollButton.addEventListener('click', () => this.rollDice());
        this.gameContainer.appendChild(this.rollButton);
        
        // Add game-specific CSS
        this.addStyles();
        
        // Start the game
        this.startGame();
    }
    
    createDiceSelection() {
        const diceSelectionContainer = document.createElement('div');
        diceSelectionContainer.className = 'dice-selection';
        
        const label = document.createElement('label');
        label.textContent = 'Number of Dice:';
        diceSelectionContainer.appendChild(label);
        
        const oneDieBtn = document.createElement('button');
        oneDieBtn.className = 'dice-select-btn active';
        oneDieBtn.textContent = '1';
        oneDieBtn.addEventListener('click', () => {
            this.diceCount = 1;
            oneDieBtn.classList.add('active');
            twoDiceBtn.classList.remove('active');
            this.resetGame();
        });
        
        const twoDiceBtn = document.createElement('button');
        twoDiceBtn.className = 'dice-select-btn';
        twoDiceBtn.textContent = '2';
        twoDiceBtn.addEventListener('click', () => {
            this.diceCount = 2;
            twoDiceBtn.classList.add('active');
            oneDieBtn.classList.remove('active');
            this.resetGame();
        });
        
        diceSelectionContainer.appendChild(oneDieBtn);
        diceSelectionContainer.appendChild(twoDiceBtn);
        
        this.gameContainer.appendChild(diceSelectionContainer);
    }
    
    startGame() {
        this.gameActive = true;
        this.playerScore = 0;
        this.computerScore = 0;
        this.roundsPlayed = 0;
        this.updateScore();
        this.resultDisplay.textContent = 'Roll the dice to start!';
        this.clearDice();
        
        // Play start sound
        if (window.gameUtils) {
            window.gameUtils.playSound('gameStart');
        }
    }
    
    resetGame() {
        this.startGame();
    }
    
    rollDice() {
        if (!this.gameActive) {
            this.resetGame();
            return;
        }
        
        // Play dice roll sound
        if (window.gameUtils) {
            window.gameUtils.playSound('diceRoll');
        }
        
        // Clear previous dice
        this.clearDice();
        
        // Roll player dice
        const playerDiceValues = [];
        let playerTotal = 0;
        
        for (let i = 0; i < this.diceCount; i++) {
            const value = Math.floor(Math.random() * 6) + 1;
            playerDiceValues.push(value);
            playerTotal += value;
            
            this.createDiceElement(
                this.playerDiceContainer.querySelector('.dice-holder'), 
                value
            );
        }
        
        // Roll computer dice
        const computerDiceValues = [];
        let computerTotal = 0;
        
        for (let i = 0; i < this.diceCount; i++) {
            const value = Math.floor(Math.random() * 6) + 1;
            computerDiceValues.push(value);
            computerTotal += value;
            
            this.createDiceElement(
                this.computerDiceContainer.querySelector('.dice-holder'), 
                value
            );
        }
        
        // Determine winner
        let result;
        if (playerTotal > computerTotal) {
            result = 'You win this round!';
            this.playerScore++;
            
            // Play success sound
            if (window.gameUtils) {
                window.gameUtils.playSound('success');
            }
        } else if (computerTotal > playerTotal) {
            result = 'Computer wins this round!';
            this.computerScore++;
            
            // Play error sound
            if (window.gameUtils) {
                window.gameUtils.playSound('error');
            }
        } else {
            result = 'It\'s a tie!';
        }
        
        // Update display
        this.roundsPlayed++;
        this.updateScore();
        this.resultDisplay.textContent = `${result} (${playerTotal} vs ${computerTotal})`;
        
        // Check if game is over
        if (this.roundsPlayed >= this.totalRounds) {
            this.endGame();
        }
    }
    
    createDiceElement(container, value) {
        const dice = document.createElement('div');
        dice.className = 'dice';
        
        // Create dice dots based on value
        for (let i = 0; i < value; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dice.appendChild(dot);
        }
        
        // Add value-specific class for dot positioning
        dice.classList.add(`dice-${value}`);
        
        // Add animation
        dice.classList.add('rolling');
        setTimeout(() => {
            dice.classList.remove('rolling');
        }, 1000);
        
        container.appendChild(dice);
    }
    
    clearDice() {
        const diceHolders = this.diceArea.querySelectorAll('.dice-holder');
        diceHolders.forEach(holder => {
            holder.innerHTML = '';
        });
    }
    
    updateScore() {
        const playerScoreElement = this.scoreDisplay.querySelector('.player-score span');
        const computerScoreElement = this.scoreDisplay.querySelector('.computer-score span');
        
        playerScoreElement.textContent = this.playerScore;
        computerScoreElement.textContent = this.computerScore;
    }
    
    endGame() {
        this.gameActive = false;
        
        let finalResult;
        if (this.playerScore > this.computerScore) {
            finalResult = 'Congratulations! You won the game!';
        } else if (this.computerScore > this.playerScore) {
            finalResult = 'Game over! Computer won the game.';
        } else {
            finalResult = 'Game ended in a tie!';
        }
        
        this.resultDisplay.textContent = finalResult;
        this.rollButton.textContent = 'Play Again';
        
        // Play game over sound
        if (window.gameUtils) {
            window.gameUtils.playSound('gameOver');
        }
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .dice-game-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .dice-selection {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }
            
            .dice-selection label {
                font-family: 'Comic Neue', sans-serif;
                font-weight: bold;
                color: #118ab2;
            }
            
            .dice-select-btn {
                background-color: #f0f0f0;
                border: 2px solid #ccc;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-family: 'Comic Neue', sans-serif;
                font-weight: bold;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .dice-select-btn.active {
                background-color: #118ab2;
                color: white;
                border-color: #118ab2;
            }
            
            .dice-score {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding: 10px;
                background-color: #f9f9f9;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .player-score, .computer-score {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }
            
            .player-score h3, .computer-score h3 {
                margin: 0;
                color: #118ab2;
            }
            
            .player-score span, .computer-score span {
                font-size: 24px;
                font-weight: bold;
                color: #ff6b6b;
            }
            
            .vs {
                font-family: 'Bubblegum Sans', cursive;
                font-size: 24px;
                color: #ffd166;
            }
            
            .dice-area {
                display: flex;
                justify-content: space-between;
                width: 100%;
                gap: 20px;
            }
            
            .dice-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .dice-container h3 {
                margin: 0 0 10px 0;
                color: #118ab2;
            }
            
            .dice-holder {
                display: flex;
                justify-content: center;
                gap: 15px;
                min-height: 100px;
                align-items: center;
            }
            
            .dice {
                width: 80px;
                height: 80px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(3, 1fr);
                padding: 10px;
                position: relative;
            }
            
            .dot {
                width: 16px;
                height: 16px;
                background-color: #ff6b6b;
                border-radius: 50%;
                align-self: center;
                justify-self: center;
                display: none;
            }
            
            /* Dot positioning for each dice value */
            .dice-1 .dot:nth-child(1) {
                display: block;
                grid-column: 2;
                grid-row: 2;
            }
            
            .dice-2 .dot:nth-child(1) {
                display: block;
                grid-column: 1;
                grid-row: 1;
            }
            
            .dice-2 .dot:nth-child(2) {
                display: block;
                grid-column: 3;
                grid-row: 3;
            }
            
            .dice-3 .dot:nth-child(1) {
                display: block;
                grid-column: 1;
                grid-row: 1;
            }
            
            .dice-3 .dot:nth-child(2) {
                display: block;
                grid-column: 2;
                grid-row: 2;
            }
            
            .dice-3 .dot:nth-child(3) {
                display: block;
                grid-column: 3;
                grid-row: 3;
            }
            
            .dice-4 .dot:nth-child(1) {
                display: block;
                grid-column: 1;
                grid-row: 1;
            }
            
            .dice-4 .dot:nth-child(2) {
                display: block;
                grid-column: 3;
                grid-row: 1;
            }
            
            .dice-4 .dot:nth-child(3) {
                display: block;
                grid-column: 1;
                grid-row: 3;
            }
            
            .dice-4 .dot:nth-child(4) {
                display: block;
                grid-column: 3;
                grid-row: 3;
            }
            
            .dice-5 .dot:nth-child(1) {
                display: block;
                grid-column: 1;
                grid-row: 1;
            }
            
            .dice-5 .dot:nth-child(2) {
                display: block;
                grid-column: 3;
                grid-row: 1;
            }
            
            .dice-5 .dot:nth-child(3) {
                display: block;
                grid-column: 2;
                grid-row: 2;
            }
            
            .dice-5 .dot:nth-child(4) {
                display: block;
                grid-column: 1;
                grid-row: 3;
            }
            
            .dice-5 .dot:nth-child(5) {
                display: block;
                grid-column: 3;
                grid-row: 3;
            }
            
            .dice-6 .dot:nth-child(1) {
                display: block;
                grid-column: 1;
                grid-row: 1;
            }
            
            .dice-6 .dot:nth-child(2) {
                display: block;
                grid-column: 3;
                grid-row: 1;
            }
            
            .dice-6 .dot:nth-child(3) {
                display: block;
                grid-column: 1;
                grid-row: 2;
            }
            
            .dice-6 .dot:nth-child(4) {
                display: block;
                grid-column: 3;
                grid-row: 2;
            }
            
            .dice-6 .dot:nth-child(5) {
                display: block;
                grid-column: 1;
                grid-row: 3;
            }
            
            .dice-6 .dot:nth-child(6) {
                display: block;
                grid-column: 3;
                grid-row: 3;
            }
            
            .dice.rolling {
                animation: roll 0.5s ease-out;
            }
            
            @keyframes roll {
                0% { transform: rotateZ(0deg); }
                100% { transform: rotateZ(360deg); }
            }
            
            .dice-result {
                font-family: 'Bubblegum Sans', cursive;
                font-size: 24px;
                color: #118ab2;
                text-align: center;
                min-height: 40px;
            }
            
            .roll-button {
                background-color: #ff6b6b;
                color: white;
                border: none;
                border-radius: 30px;
                padding: 12px 30px;
                font-family: 'Comic Neue', sans-serif;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .roll-button:hover {
                background-color: #ff5252;
                transform: scale(1.05);
            }
            
            @media (max-width: 600px) {
                .dice-area {
                    flex-direction: column;
                }
                
                .dice {
                    width: 60px;
                    height: 60px;
                }
                
                .dot {
                    width: 12px;
                    height: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the game when the script is loaded
function initDiceGame() {
    const game = new DiceGame('game-content');
}

// Initialize the game
initDiceGame();
