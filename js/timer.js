
'use strict';

// Get selected difficulty
function getSelectedDifficulty() {
    return $('input[name="difficulty"]:checked').val() || 'easy';
}

// Time limit for each difficulty
var difficultyTimes = {
    easy: 90,
    medium: 70,
    hard: 45
};

// Freeze duration for each difficulty
var freezeTimes = {
    easy: 15,
    medium: 5,
    hard: 0
};

// Timer variables
var timerInterval = null;
var timeRemaining = 0;
var startingTime = 0;
var gameStarted = false;

// Freeze variables
var freezeActive = false;
var freezeUsed = false;
var freezeTimeout = null;

// Update timer display
function updateTimerDisplay() {
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = timeRemaining % 60;

    var formattedTime =
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');

    $('#timer').text(formattedTime);
}

// Cancel an active freeze
function cancelFreeze() {
    clearTimeout(freezeTimeout);
    freezeTimeout = null;
    freezeActive = false;
}

// Reset freeze availability
function resetFreeze() {
    cancelFreeze();
    freezeUsed = false;

    $('#freeze-button').removeClass('freeze-used');
    $('#freeze-button .power-info strong').text('Freeze');
}

// Freeze countdown
function freezeTime() {
    var difficulty = getSelectedDifficulty();
    var freezeDuration = freezeTimes[difficulty];

    if (
        !gameStarted ||
        freezeActive ||
        freezeUsed ||
        freezeDuration === 0 ||
        timeRemaining <= 0
    ) {
        return;
    }

    freezeUsed = true;
    freezeActive = true;

    $('#freeze-button').addClass('freeze-used');
    $('#freeze-button .power-info strong').text('Freeze Used');

    clearInterval(timerInterval);
    timerInterval = null;

    freezeTimeout = setTimeout(function () {
        freezeActive = false;
        freezeTimeout = null;

        if (gameStarted && timeRemaining > 0) {
            startTimer();
        }
    }, freezeDuration * 1000);
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

    cancelFreeze();

    gameStarted = false;
}

// Start timer
function startTimer() {
    if (
        timerInterval !== null ||
        timeRemaining <= 0 ||
        freezeActive ||
        !gameStarted
    ) {
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

        resetFreeze();
        resetTimer();

        if (typeof startGame !== 'function') {
            $('#game-message').text('Game setup is not ready yet.');
            return;
        }

        // Initialize a fresh game
        startGame(difficulty);

        // Start the game
        gameStarted = true;

        startTimer();

        $('#game-message').text('Game started!');
    });

    // Difficulty selection
    $('input[name="difficulty"]').off('change.flipquest').on('change.flipquest', function () {

        // Stop timer and reset Freeze
        stopTimer();
        resetFreeze();

        // Cancel pending card flip-back
        clearTimeout(hideCardsTimer);
        hideCardsTimer = null;

        // Reset card selection
        firstCard = null;
        canClick = true;

        // Reset timer for selected difficulty
        resetTimer();

        // Disable cards until Play is pressed
        $('.card').prop('disabled', true);

        $('#game-message').text('Difficulty changed. Press Play to start a new game.');
    });

    // Freeze button
    $('#freeze-button').off('click.flipquest').on('click.flipquest', function () {
        freezeTime();
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

            if (
                !isNaN(index) &&
                typeof cards !== 'undefined' &&
                index >= 0 &&
                index < cards.length
            ) {
                handleCardClick(index);
            }
        });
}

// Initialize timer and controls
$(document).ready(function () {

    resetTimer();
    resetFreeze();

    // Keep cards disabled until Play is pressed
    $('.card').prop('disabled', true);

    setupControls();
});
