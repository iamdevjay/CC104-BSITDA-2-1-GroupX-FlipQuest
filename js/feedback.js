function showGameMessage(message) {
    $('#game-message').removeClass('result-victory result-gameover').text(message);
}

function clearGameMessage() {
    $('#game-message').removeClass('result-victory result-gameover').text('');
}

function updateStatsDisplay(stats) {
    const currentMoves = stats && stats.moves !== undefined ? stats.moves : (typeof moves !== 'undefined' ? moves : 0);
    const currentCombo = stats && stats.combo !== undefined ? stats.combo : (typeof combo !== 'undefined' ? combo : 0);
    const currentMatched = stats && stats.matchedPairs !== undefined ? stats.matchedPairs : (typeof correct !== 'undefined' ? correct : 0);
    const currentTotal = stats && stats.totalPairs !== undefined ? stats.totalPairs : (typeof gameMode !== 'undefined' ? gameMode : 6);

    $('#moves').text(currentMoves);
    $('#combo').text(`x${currentCombo}`);
    $('#matched-pairs').text(currentMatched);
    $('#total-pairs').text(currentTotal);
}

function showGameResult(result) {
    const $msg = $('#game-message').removeClass('result-victory result-gameover');
    const finalMoves = typeof moves !== 'undefined' ? moves : 0;

    if (result === 'victory' || result === 'win') {
        $msg.addClass('result-victory').text(`You win! Finished in ${finalMoves} moves.`);
    } else if (result === 'game-over' || result === 'timeout') {
        $msg.addClass('result-gameover').text('Time is up!');
    } else {
        $msg.text(String(result));
    }
}

function getCurrentGameStats() {
    return {
        moves: typeof moves !== 'undefined' ? moves : 0,
        combo: typeof combo !== 'undefined' ? combo : 0,
        matchedPairs: typeof correct !== 'undefined' ? correct : 0,
        totalPairs: typeof gameMode !== 'undefined' ? gameMode : 6
    };
}

function attachFeedbackHooks() {
    if (typeof startGame === 'function' && !startGame._feedbackWrapped) {
        const originalStartGame = startGame;
        startGame = function (difficulty) {
            const result = originalStartGame.apply(this, arguments);
            clearGameMessage();
            updateStatsDisplay(getCurrentGameStats());
            showGameMessage('Find all the matching pairs!');
            return result;
        };
        startGame._feedbackWrapped = true;
    }

    if (typeof handleCardClick === 'function' && !handleCardClick._feedbackWrapped) {
        const originalHandleCardClick = handleCardClick;
        handleCardClick = function (index) {
            const result = originalHandleCardClick.apply(this, arguments);
            updateStatsDisplay(getCurrentGameStats());
            return result;
        };
        handleCardClick._feedbackWrapped = true;
    }

    if (typeof endGame === 'function' && !endGame._feedbackWrapped) {
        const originalEndGame = endGame;
        endGame = function (reason) {
            const result = originalEndGame.apply(this, arguments);
            updateStatsDisplay(getCurrentGameStats());
            if (reason === 'win') {
                showGameResult('victory');
            } else {
                showGameResult('game-over');
            }
            return result;
        };
        endGame._feedbackWrapped = true;
    }
}

$(function () {
    attachFeedbackHooks();
    updateStatsDisplay(getCurrentGameStats());

    $('input[name="difficulty"]').on('change.feedback', function () {
        const level = $(this).val();
        const pairs = level === 'medium' ? 9 : level === 'hard' ? 12 : 6;
        clearGameMessage();
        updateStatsDisplay({ moves: 0, combo: 0, matchedPairs: 0, totalPairs: pairs });
        showGameMessage('Difficulty changed. Press Play to start a new game.');
    });
});