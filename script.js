// DOM Elements
const dealerCardsEl = document.getElementById('dealerCards');
const playerCardsEl = document.getElementById('playerCards');
const dealerScoreEl = document.getElementById('dealerScore');
const playerScoreEl = document.getElementById('playerScore');
const messageBoxEl = document.getElementById('messageBox');
const dealBtn = document.getElementById('dealBtn');
const hitBtn = document.getElementById('hitBtn');
const standBtn = document.getElementById('standBtn');
const clearBetBtn = document.getElementById('clearBetBtn');
const playerBalanceEl = document.getElementById('playerBalance');
const currentBetEl = document.getElementById('currentBet');
const bettingAreaEl = document.getElementById('bettingArea');
const gameControlsEl = document.getElementById('gameControls');
const chipEls = document.querySelectorAll('.chip');
const deckEl = document.getElementById('deck');

// Modal Elements
const resultModal = document.getElementById('resultModal');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const resultAmount = document.getElementById('resultAmount');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const continueBettingBtn = document.getElementById('continueBettingBtn');
const cashOutBtn = document.getElementById('cashOutBtn');

// Welcome Screen Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const startGameBtn = document.getElementById('startGameBtn');
const tutorialBtn = document.getElementById('tutorialBtn');
const statisticsBtn = document.getElementById('statisticsBtn');
const settingsBtn = document.getElementById('settingsBtn');
const totalGamesPlayedEl = document.getElementById('totalGamesPlayed');
const bestWinStreakEl = document.getElementById('bestWinStreak');
const totalWinningsDisplayEl = document.getElementById('totalWinningsDisplay');

// Tutorial Elements
const tutorialModal = document.getElementById('tutorialModal');
const tutorialCloseBtn = document.getElementById('tutorialCloseBtn');
const tutorialText = document.getElementById('tutorialText');
const tutorialImage = document.getElementById('tutorialImage');
const tutorialProgress = document.getElementById('tutorialProgress');
const tutorialPrevBtn = document.getElementById('tutorialPrevBtn');
const tutorialNextBtn = document.getElementById('tutorialNextBtn');
const tutorialOverlay = document.getElementById('tutorialOverlay');
const tutorialHighlight = document.getElementById('tutorialHighlight');
const tutorialTooltip = document.getElementById('tutorialTooltip');
const tooltipText = document.getElementById('tooltipText');
const skipTutorialBtn = document.getElementById('skipTutorialBtn');
const nextTutorialBtn = document.getElementById('nextTutorialBtn');

// Statistics Elements
const statisticsModal = document.getElementById('statisticsModal');
const statsCloseBtn = document.getElementById('statsCloseBtn');
const gamesPlayedStat = document.getElementById('gamesPlayedStat');
const gamesWonStat = document.getElementById('gamesWonStat');
const winRateStat = document.getElementById('winRateStat');
const blackjacksStat = document.getElementById('blackjacksStat');
const currentStreakStat = document.getElementById('currentStreakStat');
const bestStreakStat = document.getElementById('bestStreakStat');
const totalWinningsStat = document.getElementById('totalWinningsStat');
const highestBalanceStat = document.getElementById('highestBalanceStat');
const resetStatsBtn = document.getElementById('resetStatsBtn');
const closeStatsBtn = document.getElementById('closeStatsBtn');

// Settings Elements
const settingsModal = document.getElementById('settingsModal');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');
const soundToggle = document.getElementById('soundToggle');
const animationSpeed = document.getElementById('animationSpeed');
const autoContinue = document.getElementById('autoContinue');
const showHints = document.getElementById('showHints');
const resetSettingsBtn = document.getElementById('resetSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

// Audio Elements
const chipSound = new Audio('assets/sounds/chip_stack.mp3');
const cardSound = new Audio('assets/sounds/card_deal.mp3');
const cardFlipSound = new Audio('assets/sounds/card_flip.mp3');
const winSound = new Audio('assets/sounds/win.mp3');
const loseSound = new Audio('assets/sounds/lose.mp3');
const pushSound = new Audio('assets/sounds/push.mp3');
const buttonSound = new Audio('assets/sounds/button.mp3');

// Game State
let deck = [];
let dealerCards = [];
let playerCards = [];
let dealerScore = 0;
let playerScore = 0;
let gameOver = false;
let dealerHiddenCard = null;
let playerBalance = 1000;
let currentBet = 0;
let gameInProgress = false;
let points = 0; // For the points system
let lastBalanceThresholdForPoint = 0; // For the points system
let totalWinnings = 0; // Track total winnings for cash out

// New State Variables for Features
let gameStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    blackjacks: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalWinnings: 0,
    highestBalance: 1000
};

let gameSettings = {
    soundEnabled: true,
    animationSpeed: 'normal',
    autoContinue: false,
    showHints: true
};

let tutorialData = [
    {
        title: "Welcome to Blackjack!",
        text: "Get as close to 21 as possible without going over. Face cards are worth 10, Aces are worth 1 or 11.",
        target: null
    },
    {
        title: "Placing Bets",
        text: "Click on the chip buttons to place your bet. You must place a bet before you can deal cards.",
        target: ".chips-container"
    },
    {
        title: "Dealing Cards",
        text: "Click the Deal button to start a new game. You'll get 2 cards face up, dealer gets 1 face up and 1 face down.",
        target: "#dealBtn"
    },
    {
        title: "Hit or Stand",
        text: "Click Hit to draw another card, or Stand to keep your current hand. Be careful not to go over 21!",
        target: ".game-controls"
    },
    {
        title: "Winning & Losing",
        text: "Beat the dealer without busting to win! Blackjack (21 with 2 cards) pays 3:2.",
        target: ".game-area"
    },
    {
        title: "Managing Your Balance",
        text: "Keep track of your balance here. You can cash out anytime or keep playing to build your winnings!",
        target: ".balance-area"
    },
    {
        title: "You're Ready!",
        text: "That's all you need to know! Good luck and have fun playing Blackjack!",
        target: null
    }
];

let currentTutorialStep = 0;
let isFirstTime = true;
let interactiveTutorialActive = false;

// Define deck position for animations
const deckPosition = { x: -200, y: 0 };

// Card Suits and Values
const suits = ['♠', '♥', '♦', '♣'];
const suitNames = {
    '♠': 'spades',
    '♥': 'hearts',
    '♦': 'diamonds',
    '♣': 'clubs'
};
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const valueNames = {
    'A': 'ace',
    'J': 'jack',
    'Q': 'queen',
    'K': 'king'
};

// Initial setup
function initializeGame() {
    // Load saved data
    loadGameData();
    
    // Check if first time visiting
    if (isFirstTime) {
        showWelcomeScreen();
    } else {
        hideWelcomeScreen();
    }
    
    updateBalanceDisplay();
    updateBetDisplay();
    updateWelcomeStats();
    
    // Apply settings
    applySettings();
    
    // Preload sounds
    chipSound.preload = 'auto';
    cardSound.preload = 'auto';
    winSound.preload = 'auto';
    loseSound.preload = 'auto';
    pushSound.preload = 'auto';
    buttonSound.preload = 'auto';
    
    // Add event listeners for betting chips
    chipEls.forEach(chip => {
        chip.addEventListener('click', () => {
            addToBet(parseInt(chip.getAttribute('data-value')));
        });
    });
    
    // Clear bet button event
    clearBetBtn.addEventListener('click', clearBet);
    
    // Create and shuffle deck
    deck = shuffleDeck(createDeck());
    
    // Setup button states
    updateButtonStates();
}

// Create a deck of cards
function createDeck() {
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    // Sound will be played on user interaction, not during initialization
    return deck;
}

// Get the card's numeric value
function getCardValue(card) {
    if (card.value === 'A') {
        return 11;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
        return 10;
    } else {
        return parseInt(card.value);
    }
}

// Calculate the score of a hand
function calculateScore(cards) {
    let score = 0;
    let aces = 0;
    
    for (let card of cards) {
        if (card.value === 'A') {
            aces++;
        }
        score += getCardValue(card);
    }
    
    // Adjust for aces if needed
    while (score > 21 && aces > 0) {
        score -= 10; // Convert an ace from 11 to 1
        aces--;
    }
    
    return score;
}

// Get the card image file name
function getCardImagePath(card) {
    if (!card) return './assets/cards/backs/blue.svg';
    
    const suitName = suitNames[card.suit];
    let valueName = card.value.toString().toLowerCase();
    
    // Use expanded names for face cards and ace
    if (valueNames[card.value]) {
        valueName = valueNames[card.value];
    }
    
    return `./assets/cards/${suitName}_${valueName}.svg`;
}

// Create a visual card element
function createCardElement(card, isHidden = false) {
    const cardEl = document.createElement('div');
    cardEl.classList.add('card');
    
    const cardImg = document.createElement('img');
    cardImg.classList.add('card-img');
    
    if (isHidden) {
        cardImg.src = './assets/cards/backs/blue.svg';
        cardEl.classList.add('back');
    } else {
        cardImg.src = getCardImagePath(card);
        if (card.suit === '♥' || card.suit === '♦') {
            cardEl.classList.add('red');
        }
    }
    
    cardEl.appendChild(cardImg);
    
    // Set initial position for animation
    cardEl.style.position = 'relative';
    cardEl.style.left = `${deckPosition.x}px`;
    cardEl.style.opacity = '0';
    cardEl.style.transform = 'rotate(-15deg)';
    
    // Trigger the animation after a small delay
    setTimeout(() => {
        cardEl.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        cardEl.style.left = '0';
        cardEl.style.opacity = '1';
        cardEl.style.transform = 'rotate(0)';
    }, 50);
    
    return cardEl;
}

// Deal a card from the deck
function dealCard() {
    if (deck.length < 10) {
        // Reshuffle if deck is running low
        deck = shuffleDeck(createDeck());
    }
    
    playSound(cardSound);
    
    return deck.pop();
}

// Update scores display
function updateScores() {
    dealerScoreEl.textContent = dealerHiddenCard ? '?' : dealerScore;
    playerScoreEl.textContent = playerScore;
}

// Check for game end conditions
function checkGameEnd() {
    if (playerScore === 21) {
        // BlackJack! Player wins 1.5x bet
        endGame('Blackjack!', true, true);
    } else if (playerScore > 21) {
        // Player busts
        endGame('Bust! You lose.', false);
    }
}

// Update player balance display
function updateBalanceDisplay() {
    playerBalanceEl.textContent = `$${playerBalance}`;

    // Points system: Points = current balance * 100
    points = playerBalance * 100;
}

// Update current bet display
function updateBetDisplay() {
    currentBetEl.textContent = `$${currentBet}`;
}

// Add to current bet with animation
function addToBet(amount) {
    if (gameInProgress) return;
    
    if (amount <= playerBalance) {
        // Create a chip animation
        const chipValue = amount;
        animateChip(chipValue, true);
        
        playSound(chipSound);
        
        currentBet += amount;
        playerBalance -= amount;
        updateBalanceDisplay();
        updateBetDisplay();
        updateButtonStates();
    } else {
        flashMessage("Not enough funds!");
    }
}

// Animate a chip moving to or from the betting area
function animateChip(value, isBetting = true) {
    // Create a temporary chip for animation
    const tempChip = document.createElement('div');
    tempChip.classList.add('chip', 'temp-chip');
    tempChip.textContent = `$${value}`;
    
    // Set chip color based on value
    let chipClass = '';
    if (value === 5) chipClass = 'chip-5';
    else if (value === 25) chipClass = 'chip-25';
    else if (value === 100) chipClass = 'chip-100';
    else if (value === 500) chipClass = 'chip-500';
    else if (value <= 5) chipClass = 'chip-5';
    else if (value <= 25) chipClass = 'chip-25';
    else if (value <= 100) chipClass = 'chip-100';
    else chipClass = 'chip-500';
    
    tempChip.classList.add(chipClass);
    
    document.body.appendChild(tempChip);
    
    // Get positions for animation
    const chipSourceEl = document.querySelector(`.chip[data-value="${Math.min(value, 500)}"]`) || 
                         document.querySelector(`.chip[data-value="500"]`);
    const chipRect = chipSourceEl.getBoundingClientRect();
    const betAreaRect = currentBetEl.getBoundingClientRect();
    
    // Set starting position
    tempChip.style.position = 'fixed';
    
    if (isBetting) {
        // Animate from chip stack to bet area
        tempChip.style.left = `${chipRect.left}px`;
        tempChip.style.top = `${chipRect.top}px`;
        
        // Trigger animation
        setTimeout(() => {
            tempChip.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            tempChip.style.left = `${betAreaRect.left + betAreaRect.width / 2 - 30}px`;
            tempChip.style.top = `${betAreaRect.top}px`;
            
            // Remove the element after animation
            setTimeout(() => {
                tempChip.remove();
            }, 600);
        }, 10);
    } else {
        // Animate from bet area to player balance or off-screen
        tempChip.style.left = `${betAreaRect.left + betAreaRect.width / 2 - 30}px`;
        tempChip.style.top = `${betAreaRect.top}px`;
        
        const finalX = isBetting ? betAreaRect.left : chipRect.left;
        const finalY = isBetting ? betAreaRect.top : chipRect.top;
        
        // Trigger animation
        setTimeout(() => {
            tempChip.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            tempChip.style.left = `${finalX}px`;
            tempChip.style.top = `${finalY}px`;
            
            // Remove the element after animation
            setTimeout(() => {
                tempChip.remove();
            }, 600);
        }, 10);
    }
}

// Clear current bet
function clearBet() {
    if (gameInProgress) return;
    
    // Animate chips returning
    if (currentBet > 0) {
        // Simplify by animating one chip representing the total bet
        animateChip(currentBet, false);
    }
    
    playerBalance += currentBet;
    currentBet = 0;
    updateBalanceDisplay();
    updateBetDisplay();
    updateButtonStates();
}

// Flash a message in the message box temporarily
function flashMessage(message, duration = 1500) {
    const originalMessage = messageBoxEl.textContent;
    messageBoxEl.textContent = message;
    
    setTimeout(() => {
        messageBoxEl.textContent = originalMessage;
    }, duration);
}

// Update button states based on game state
function updateButtonStates() {
    dealBtn.disabled = currentBet <= 0 || gameInProgress;
    hitBtn.disabled = !gameInProgress;
    standBtn.disabled = !gameInProgress;
    
    // Show/hide appropriate controls
    bettingAreaEl.style.display = gameInProgress ? 'none' : 'block';
    gameControlsEl.style.display = gameInProgress ? 'flex' : 'none';
}

// Show modal with result
function showResultModal(title, message, amount = '', isWin = false) {
    resultTitle.textContent = title;
    resultMessage.textContent = message;
    resultAmount.textContent = amount;
    
    if (isWin) {
        // Show cash out and continue options for wins
        continueBettingBtn.style.display = 'inline-block';
        cashOutBtn.style.display = 'inline-block';
        modalCloseBtn.style.display = 'none';
    } else {
        // Show only continue for losses/pushes
        continueBettingBtn.style.display = 'none';
        cashOutBtn.style.display = 'none';
        modalCloseBtn.style.display = 'inline-block';
    }
    
    resultModal.style.display = 'flex';
}

// Hide modal
function hideResultModal() {
    resultModal.style.display = 'none';
}

// Cash out function
function cashOut() {
    const finalBalance = playerBalance;
    const finalPoints = finalBalance * 100;
    
    console.log(`CASH OUT - Final Balance: $${finalBalance}, Points: ${finalPoints}`);
    
    // Show final result
    showResultModal(
        'Cash Out Complete!',
        `You cashed out with $${finalBalance}`,
        `Total Points: ${finalPoints}`,
        false
    );
    
    // Reset game after a delay
    setTimeout(() => {
        playerBalance = 1000;
        currentBet = 0;
        points = 0;
        totalWinnings = 0;
        updateBalanceDisplay();
        updateBetDisplay();
        hideResultModal();
    }, 3000);
}

// End the game
function endGame(message, playerWins = false, isBlackjack = false) {
    gameOver = true;
    gameInProgress = false;
    
    // Reveal dealer's hidden card if there is one
    if (dealerHiddenCard) {
        revealDealerCard();
    }
    
    // Handle betting outcomes with chip animations
    if (playerWins) {
        let winnings = 0;
        let title = '';
        
        if (isBlackjack) {
            // BlackJack pays 3:2
            winnings = Math.floor(currentBet * 1.5);
            title = 'Blackjack!';
            
            // Animate winnings
            setTimeout(() => {
                animateChip(currentBet + winnings, false);
            }, 500);
            
            playSound(winSound);
            
            playerBalance += (currentBet + winnings);
            totalWinnings += winnings;
            
            // Update statistics
            updateGameStats(true, true, winnings);
        } else {
            // Normal win pays 1:1
            winnings = currentBet;
            title = 'You Win!';
            
            // Animate winnings
            setTimeout(() => {
                animateChip(currentBet * 2, false);
            }, 500);
            
            playSound(winSound);
            
            playerBalance += (currentBet * 2);
            totalWinnings += winnings;
            
            // Update statistics
            updateGameStats(true, false, winnings);
        }
        
        updateBalanceDisplay();
        
        // Show win modal with options
        setTimeout(() => {
            showResultModal(
                title,
                `You won $${winnings}!`,
                `New Balance: $${playerBalance}`,
                true
            );
        }, 1000);
        
    } else if (message.includes('Push')) {
        // Push - return bet
        
        // Animate returned bet
        setTimeout(() => {
            animateChip(currentBet, false);
        }, 500);
        
        playSound(pushSound);
        
        playerBalance += currentBet;
        updateBalanceDisplay();
        
        // Update statistics (push doesn't count as win or loss)
        gameStats.gamesPlayed++;
        saveGameData();
        updateWelcomeStats();
        
        // Show push modal
        setTimeout(() => {
            showResultModal(
                'Push!',
                'It\'s a tie. Your bet has been returned.',
                `Balance: $${playerBalance}`,
                false
            );
        }, 1000);
        
    } else {
        // Player loses - animate chips disappearing
        playSound(loseSound);
        
        setTimeout(() => {
            const betAreaRect = currentBetEl.getBoundingClientRect();
            const tempChip = document.createElement('div');
            tempChip.classList.add('chip', 'temp-chip');
            tempChip.textContent = `$${currentBet}`;
            
            document.body.appendChild(tempChip);
            
            tempChip.style.position = 'fixed';
            tempChip.style.left = `${betAreaRect.left + betAreaRect.width / 2 - 30}px`;
            tempChip.style.top = `${betAreaRect.top}px`;
            
            setTimeout(() => {
                tempChip.style.transition = 'all 0.5s ease-out';
                tempChip.style.opacity = '0';
                tempChip.style.transform = 'scale(0.5)';
                
                setTimeout(() => {
                    tempChip.remove();
                }, 500);
            }, 10);
        }, 500);
        
        updateBalanceDisplay();
        
        // Update statistics
        updateGameStats(false);
        
        // Show loss modal
        setTimeout(() => {
            showResultModal(
                'You Lose!',
                message,
                `Balance: $${playerBalance}`,
                false
            );
        }, 1000);
    }
    
    // Check if player is out of money
    if (playerBalance <= 0) {
        setTimeout(() => {
            showResultModal(
                'Game Over!',
                'You\'re out of chips. Resetting balance.',
                'New Balance: $1000',
                false
            );
            setTimeout(() => {
                playerBalance = 1000;
                totalWinnings = 0;
                updateBalanceDisplay();
                hideResultModal();
            }, 2000);
        }, 2000);
    }
    
    currentBet = 0;
    updateBetDisplay();
    updateButtonStates();
    
    // Auto-continue if enabled
    if (gameSettings.autoContinue && playerBalance > 0) {
        setTimeout(() => {
            hideResultModal();
            messageBoxEl.textContent = 'Place your bet to continue!';
        }, 3000);
    }
}

// Reveal dealer's hidden card
function revealDealerCard() {
    dealerCardsEl.innerHTML = '';
    dealerCards.forEach(card => {
        dealerCardsEl.appendChild(createCardElement(card));
    });
    
    playSound(cardFlipSound);
    
    dealerHiddenCard = null;
    dealerScore = calculateScore(dealerCards);
    updateScores();
}

// Dealer's turn
function dealerTurn() {
    revealDealerCard();
    
    // Check if player has busted
    if (playerScore > 21) return;
    
    // Dealer hits until 17 or higher
    const dealerPlay = () => {
        if (dealerScore < 17) {
            const card = dealCard();
            dealerCards.push(card);
            dealerCardsEl.appendChild(createCardElement(card));
            dealerScore = calculateScore(dealerCards);
            updateScores();
            
            // Add a slight delay for better user experience
            setTimeout(dealerPlay, 800);
        } else {
            determineWinner();
        }
    };
    
    setTimeout(dealerPlay, 800);
}

// Determine winner
function determineWinner() {
    if (dealerScore > 21) {
        endGame('Dealer busts!', true);
    } else if (dealerScore > playerScore) {
        endGame('Dealer wins.');
    } else if (dealerScore < playerScore) {
        endGame('You win!', true);
    } else {
        endGame('Push! It\'s a tie.');
    }
}

// Start a new game
function startGame() {
    if (currentBet <= 0) {
        flashMessage("Please place a bet first!");
        return;
    }
    
    gameInProgress = true;
    gameOver = false;
    updateButtonStates();
    
    // Clear the table
    dealerCardsEl.innerHTML = '';
    playerCardsEl.innerHTML = '';
    messageBoxEl.textContent = 'Good luck!';
    
    // Reset game state
    if (deck.length < 15) { // Reshuffle if deck is running low
        deck = shuffleDeck(createDeck());
    }
    dealerCards = [];
    playerCards = [];
    
    // Deal initial cards with animation delay
    setTimeout(() => {
        playerCards.push(dealCard());
        playerCardsEl.appendChild(createCardElement(playerCards[0]));
        
        setTimeout(() => {
            dealerCards.push(dealCard());
            dealerCardsEl.appendChild(createCardElement(dealerCards[0]));
            
            setTimeout(() => {
                playerCards.push(dealCard());
                playerCardsEl.appendChild(createCardElement(playerCards[1]));
                
                setTimeout(() => {
                    // Dealer's second card is hidden
                    dealerCards.push(dealCard());
                    dealerHiddenCard = dealerCards[1];
                    dealerCardsEl.appendChild(createCardElement(dealerHiddenCard, true));
                    
                    // Calculate scores
                    playerScore = calculateScore(playerCards);
                    dealerScore = calculateScore(dealerCards);
                    
                    updateScores();
                    checkGameEnd();
                }, 300);
            }, 300);
        }, 300);
    }, 300);
}

// Event Listeners
dealBtn.addEventListener('click', () => {
    playSound(buttonSound);
    startGame();
});

hitBtn.addEventListener('click', () => {
    if (gameOver) return;
    
    playSound(buttonSound);
    
    const card = dealCard();
    playerCards.push(card);
    playerCardsEl.appendChild(createCardElement(card));
    
    playerScore = calculateScore(playerCards);
    updateScores();
    
    checkGameEnd();
});

standBtn.addEventListener('click', () => {
    if (gameOver) return;
    
    playSound(buttonSound);
    
    hitBtn.disabled = true;
    standBtn.disabled = true;
    
    dealerTurn();
});

clearBetBtn.addEventListener('click', () => {
    playSound(buttonSound);
    clearBet();
});

// Modal event listeners
continueBettingBtn.addEventListener('click', () => {
    playSound(buttonSound);
    
    hideResultModal();
    
    // Clear the table immediately
    dealerCardsEl.innerHTML = '';
    playerCardsEl.innerHTML = '';
    
    // Reset scores display
    dealerScoreEl.textContent = '0';
    playerScoreEl.textContent = '0';
    
    // Reset game state
    dealerCards = [];
    playerCards = [];
    dealerScore = 0;
    playerScore = 0;
    gameOver = false;
    dealerHiddenCard = null;
    
    // Update button states
    updateButtonStates();
    
    messageBoxEl.textContent = 'Place your bet to continue!';
});

cashOutBtn.addEventListener('click', () => {
    playSound(buttonSound);
    cashOut();
});

modalCloseBtn.addEventListener('click', () => {
    playSound(buttonSound);
    hideResultModal();
    messageBoxEl.textContent = 'Place your bet to start playing!';
});

// Close modal when clicking outside
resultModal.addEventListener('click', (e) => {
    if (e.target === resultModal) {
        hideResultModal();
        messageBoxEl.textContent = 'Place your bet to continue!';
    }
});

// Welcome Screen Event Listeners
startGameBtn.addEventListener('click', () => {
    playSound(buttonSound);
    if (isFirstTime) {
        startInteractiveTutorial();
    } else {
        hideWelcomeScreen();
        messageBoxEl.textContent = 'Place your bet to start playing!';
    }
});

tutorialBtn.addEventListener('click', () => {
    playSound(buttonSound);
    startTutorial();
});

statisticsBtn.addEventListener('click', () => {
    playSound(buttonSound);
    showStatistics();
});

settingsBtn.addEventListener('click', () => {
    playSound(buttonSound);
    showSettings();
});

// Tutorial Event Listeners
tutorialCloseBtn.addEventListener('click', () => {
    playSound(buttonSound);
    closeTutorial();
});

tutorialNextBtn.addEventListener('click', () => {
    playSound(buttonSound);
    nextTutorialStep();
});

tutorialPrevBtn.addEventListener('click', () => {
    playSound(buttonSound);
    prevTutorialStep();
});

skipTutorialBtn.addEventListener('click', () => {
    playSound(buttonSound);
    skipTutorial();
});

// Fixed: Use different variable name to avoid conflict
document.getElementById('nextTutorialBtn').addEventListener('click', () => {
    playSound(buttonSound);
    nextInteractiveTutorialStep();
});

// Statistics Event Listeners
statsCloseBtn.addEventListener('click', () => {
    playSound(buttonSound);
    statisticsModal.style.display = 'none';
});

closeStatsBtn.addEventListener('click', () => {
    playSound(buttonSound);
    statisticsModal.style.display = 'none';
});

resetStatsBtn.addEventListener('click', () => {
    playSound(buttonSound);
    resetStatistics();
});

// Settings Event Listeners
settingsCloseBtn.addEventListener('click', () => {
    playSound(buttonSound);
    settingsModal.style.display = 'none';
});

saveSettingsBtn.addEventListener('click', () => {
    playSound(buttonSound);
    saveSettings();
});

resetSettingsBtn.addEventListener('click', () => {
    playSound(buttonSound);
    resetSettings();
});

// Modal close when clicking outside
statisticsModal.addEventListener('click', (e) => {
    if (e.target === statisticsModal) {
        statisticsModal.style.display = 'none';
    }
});

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

tutorialModal.addEventListener('click', (e) => {
    if (e.target === tutorialModal) {
        closeTutorial();
    }
});

// Initialize the game on load
document.addEventListener('DOMContentLoaded', initializeGame);

// Data Management Functions
function saveGameData() {
    try {
        localStorage.setItem('blackjack_stats', JSON.stringify(gameStats));
        localStorage.setItem('blackjack_settings', JSON.stringify(gameSettings));
        localStorage.setItem('blackjack_balance', playerBalance.toString());
        localStorage.setItem('blackjack_first_time', 'false');
    } catch (e) {
        console.log('Error saving game data:', e);
    }
}

function loadGameData() {
    try {
        const savedStats = localStorage.getItem('blackjack_stats');
        const savedSettings = localStorage.getItem('blackjack_settings');
        const savedBalance = localStorage.getItem('blackjack_balance');
        const firstTime = localStorage.getItem('blackjack_first_time');
        
        if (savedStats) {
            gameStats = { ...gameStats, ...JSON.parse(savedStats) };
        }
        
        if (savedSettings) {
            gameSettings = { ...gameSettings, ...JSON.parse(savedSettings) };
        }
        
        if (savedBalance) {
            playerBalance = parseInt(savedBalance);
        }
        
        isFirstTime = firstTime !== 'false';
        
    } catch (e) {
        console.log('Error loading game data:', e);
    }
}

function resetGameData() {
    gameStats = {
        gamesPlayed: 0,
        gamesWon: 0,
        blackjacks: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalWinnings: 0,
        highestBalance: 1000
    };
    playerBalance = 1000;
    saveGameData();
}

// Welcome Screen Functions
function showWelcomeScreen() {
    welcomeScreen.style.display = 'flex';
    updateWelcomeStats();
}

function hideWelcomeScreen() {
    welcomeScreen.style.display = 'none';
}

function updateWelcomeStats() {
    totalGamesPlayedEl.textContent = gameStats.gamesPlayed;
    bestWinStreakEl.textContent = gameStats.bestStreak;
    totalWinningsDisplayEl.textContent = `$${gameStats.totalWinnings}`;
}

// Apply settings
function applySettings() {
    soundToggle.checked = gameSettings.soundEnabled;
    animationSpeed.value = gameSettings.animationSpeed;
    autoContinue.checked = gameSettings.autoContinue;
    showHints.checked = gameSettings.showHints;
    
    // Apply animation speed
    const root = document.documentElement;
    switch (gameSettings.animationSpeed) {
        case 'slow':
            root.style.setProperty('--animation-duration', '1.2s');
            break;
        case 'fast':
            root.style.setProperty('--animation-duration', '0.4s');
            break;
        default:
            root.style.setProperty('--animation-duration', '0.8s');
    }
}

// Tutorial System Functions
function startTutorial() {
    currentTutorialStep = 0;
    tutorialModal.style.display = 'flex';
    showTutorialStep();
}

function startInteractiveTutorial() {
    currentTutorialStep = 0;
    interactiveTutorialActive = true;
    hideWelcomeScreen();
    
    // Mark that tutorial has been started (no longer first time)
    isFirstTime = false;
    localStorage.setItem('blackjack_first_time', 'false');
    
    // Show the first tutorial step
    showInteractiveTutorialStep();
}

function showTutorialStep() {
    const step = tutorialData[currentTutorialStep];
    tutorialText.textContent = step.text;
    tutorialProgress.textContent = `${currentTutorialStep + 1}/${tutorialData.length}`;
    
    // Update button states
    tutorialPrevBtn.disabled = currentTutorialStep === 0;
    tutorialNextBtn.textContent = currentTutorialStep === tutorialData.length - 1 ? 'Finish' : 'Next';
    
    // Show placeholder for tutorial images
    tutorialImage.textContent = `Step ${currentTutorialStep + 1} Visual Guide`;
}

function showInteractiveTutorialStep() {
    const step = tutorialData[currentTutorialStep];
    console.log(`Showing tutorial step ${currentTutorialStep + 1}: ${step.title}`);
    
    // Show overlay first
    tutorialOverlay.style.display = 'block';
    
    // Handle steps without targets (like welcome message)
    if (!step.target) {
        console.log('Step has no target, showing center tooltip');
        // Hide highlight for steps without targets
        tutorialHighlight.style.display = 'none';
        
        // Position tooltip in center of screen
        tooltipText.textContent = step.text;
        tutorialTooltip.style.left = '50%';
        tutorialTooltip.style.top = '50%';
        tutorialTooltip.style.transform = 'translate(-50%, -50%)';
        tutorialTooltip.style.display = 'block';
        return;
    }
    
    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
        console.log(`Tutorial target not found: ${step.target}`);
        nextInteractiveTutorialStep();
        return;
    }
    
    console.log(`Found target element: ${step.target}`);
    
    // Show highlight for steps with targets
    tutorialHighlight.style.display = 'block';
    
    // Force show betting area and game controls for tutorial
    if (step.target === '.chips-container' || step.target === '#dealBtn') {
        bettingAreaEl.style.display = 'block';
    }
    if (step.target === '.game-controls') {
        gameControlsEl.style.display = 'flex';
    }
    
    // Position highlight
    const rect = targetElement.getBoundingClientRect();
    tutorialHighlight.style.left = `${rect.left - 10}px`;
    tutorialHighlight.style.top = `${rect.top - 10}px`;
    tutorialHighlight.style.width = `${rect.width + 20}px`;
    tutorialHighlight.style.height = `${rect.height + 20}px`;
    
    // Position tooltip
    tooltipText.textContent = step.text;
    const tooltipX = rect.left + rect.width / 2;
    const tooltipY = rect.bottom + 20;
    
    // Ensure tooltip stays on screen
    const maxX = window.innerWidth - 320;
    const maxY = window.innerHeight - 200;
    
    tutorialTooltip.style.left = `${Math.max(10, Math.min(tooltipX - 150, maxX))}px`;
    tutorialTooltip.style.top = `${Math.min(tooltipY, maxY)}px`;
    tutorialTooltip.style.transform = 'none';
    tutorialTooltip.style.display = 'block';
    
    console.log(`Tooltip positioned at: ${tutorialTooltip.style.left}, ${tutorialTooltip.style.top}`);
}

function nextInteractiveTutorialStep() {
    currentTutorialStep++;
    
    if (currentTutorialStep >= tutorialData.length) {
        closeInteractiveTutorial();
    } else {
        showInteractiveTutorialStep();
    }
}

function closeInteractiveTutorial() {
    tutorialOverlay.style.display = 'none';
    tutorialHighlight.style.display = 'none';
    tutorialTooltip.style.display = 'none';
    interactiveTutorialActive = false;
    
    // Restore normal game state
    updateButtonStates();
    messageBoxEl.textContent = 'Tutorial complete! Place your bet to start playing!';
}

function closeTutorial() {
    tutorialModal.style.display = 'none';
}

function skipTutorial() {
    closeInteractiveTutorial();
}

function nextTutorialStep() {
    if (currentTutorialStep < tutorialData.length - 1) {
        currentTutorialStep++;
        showTutorialStep();
    } else {
        closeTutorial();
    }
}

function prevTutorialStep() {
    if (currentTutorialStep > 0) {
        currentTutorialStep--;
        showTutorialStep();
    }
}

// Statistics Functions
function updateGameStats(won, isBlackjack = false, winnings = 0) {
    gameStats.gamesPlayed++;
    
    if (won) {
        gameStats.gamesWon++;
        gameStats.currentStreak++;
        gameStats.bestStreak = Math.max(gameStats.bestStreak, gameStats.currentStreak);
        gameStats.totalWinnings += winnings;
        
        if (isBlackjack) {
            gameStats.blackjacks++;
        }
    } else {
        gameStats.currentStreak = 0;
    }
    
    gameStats.highestBalance = Math.max(gameStats.highestBalance, playerBalance);
    
    saveGameData();
    updateWelcomeStats();
}

function showStatistics() {
    statisticsModal.style.display = 'flex';
    updateStatisticsDisplay();
}

function updateStatisticsDisplay() {
    gamesPlayedStat.textContent = gameStats.gamesPlayed;
    gamesWonStat.textContent = gameStats.gamesWon;
    
    const winRate = gameStats.gamesPlayed > 0 ? 
        Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100) : 0;
    winRateStat.textContent = `${winRate}%`;
    
    blackjacksStat.textContent = gameStats.blackjacks;
    currentStreakStat.textContent = gameStats.currentStreak;
    bestStreakStat.textContent = gameStats.bestStreak;
    totalWinningsStat.textContent = `$${gameStats.totalWinnings}`;
    highestBalanceStat.textContent = `$${gameStats.highestBalance}`;
}

function resetStatistics() {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        resetGameData();
        updateStatisticsDisplay();
        updateWelcomeStats();
        flashMessage('Statistics reset successfully!');
    }
}

// Settings Functions
function showSettings() {
    settingsModal.style.display = 'flex';
    applySettings();
}

function saveSettings() {
    gameSettings.soundEnabled = soundToggle.checked;
    gameSettings.animationSpeed = animationSpeed.value;
    gameSettings.autoContinue = autoContinue.checked;
    gameSettings.showHints = showHints.checked;
    
    saveGameData();
    applySettings();
    settingsModal.style.display = 'none';
    flashMessage('Settings saved successfully!');
}

function resetSettings() {
    if (confirm('Reset all settings to default values?')) {
        gameSettings = {
            soundEnabled: true,
            animationSpeed: 'normal',
            autoContinue: false,
            showHints: true
        };
        applySettings();
        flashMessage('Settings reset to default!');
    }
}

// Sound helper function
function playSound(audio) {
    if (gameSettings.soundEnabled) {
        try {
            audio.play().catch(e => console.log("Audio play error:", e));
        } catch (e) {
            console.log("Audio error:", e);
        }
    }
} 