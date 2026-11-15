
'use strict';

// Get selected difficulty
function getSelectedDifficulty() {
    return $('input[name="difficulty"]:checked').val() || 'medium';
}

// Time limit for each difficulty
var difficultyTimes = {
    easy: 120,
    medium: 90,
    hard: 60
};

// Timer variables
var timerInterval = null;
var timeRemaining = 0;
var startingTime = 0;
var gameStarted = false;

// Update timer display
function updateTimerDisplay() {
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = timeRemaining % 60;

    var formattedTime =
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');

    $('#timer').text(formattedTime);
}

// Reset timer
function resetTimer() {
    stopTimer();

    var difficulty = getSelectedDifficulty();

    startingTime = difficultyTimes[difficulty] || difficultyTimes.medium;
    timeRemaining = startingTime;

    updateTimerDisplay();
    $('#time-limit').text(startingTime);
}

// Stop timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    gameStarted = false;
}

// Start timer
function startTimer() {
    if (timerInterval !== null || timeRemaining <= 0) {
        return;
    }

    timerInterval = setInterval(function () {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            stopTimer();

            if (typeof endGame === 'function') {
                endGame('timeout');
            } else {
                $('#game-message').text('Time is up!');
                $('.card').prop('disabled', true);
            }
        }
    }, 1000);
}

// Setup game controls
function setupControls() {

    // Play button
    $('#play-button').off('click.flipquest').on('click.flipquest', function () {
        var difficulty = getSelectedDifficulty();

        resetTimer();

        // Check if game.js has the required function
        if (typeof startGame !== 'function') {
            $('#game-message').text('Game setup is not ready yet.');
            return;
        }

        // Initialize or reset the game
        startGame(difficulty);

        gameStarted = true;
        startTimer();

        $('#game-message').text('Game started!');
    });

    // Difficulty selection
    $('input[name="difficulty"]').off('change.flipquest').on('change.flipquest', function () {
        stopTimer();
        resetTimer();

        $('#game-message').text('Difficulty changed. Press Play to start a new game.');
    });

    // Card clicks
    $('#card-grid').off('click.flipquest', '.card')
        .on('click.flipquest', '.card', function () {

            if (!gameStarted || timeRemaining <= 0) {
                return;
            }

            if (typeof handleCardClick !== 'function') {
                return;
            }

            // Convert card ID into a 0-based index
            var index = parseInt(this.id.replace('card', ''), 10) - 1;

            if (!isNaN(index)) {
                handleCardClick(index);
            }
        });
}

// Initialize timer and controls
$(document).ready(function () {
    resetTimer();
    setupControls();
});
//Hello