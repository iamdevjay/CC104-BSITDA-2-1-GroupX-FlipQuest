function ensureFeedbackStyles() {
    if ($('#feedback-window-styles').length) {
        return;
    }

    const css = `
        #game-message.feedback-visible {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            background: var(--lcd-0);
            color: var(--lcd-3);
            box-shadow: 2px 2px 0 var(--lcd-1);
            animation: feedbackPulse 0.25s ease-out;
        }
        #game-message.result-victory {
            background: var(--lcd-0);
            color: var(--lcd-3);
        }
        #game-message.result-gameover {
            background: var(--accent);
            color: #ffffff;
        }
        .stat-box h2.stat-updated {
            animation: feedbackPulse 0.25s ease-out;
        }
        #time-limit.time-low {
    color: #ff0000;
    animation: feedbackPulse 1s ease-out infinite;
}
        @keyframes feedbackPulse {
            0% { transform: scale(1.06); }
            100% { transform: scale(1); }
        }
        #feedback-result-modal {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(15, 12, 28, 0.75);
            font-family: var(--font, "Pixelify Sans", "Courier New", monospace);
        }
        #feedback-result-modal.is-open {
            display: flex;
        }
        #feedback-result-card {
            width: 100%;
            max-width: 380px;
            padding: 20px 22px;
            background: var(--lcd-3, #9bbc0f);
            color: var(--lcd-0, #0f380f);
            border: 4px solid var(--ink, #1d1a2b);
            outline: 6px solid var(--bezel, #3f3d56);
            border-radius: 10px;
            box-shadow: 8px 8px 0 var(--ink, #1d1a2b);
            text-align: center;
        }
        #feedback-result-title {
            font-size: 1.7rem;
            font-weight: 700;
            margin-bottom: 8px;
        }
        #feedback-result-subtitle {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 14px;
            color: var(--lcd-1, #306230);
        }
        #feedback-result-best {
            min-height: 1.2em;
            margin: -6px 0 12px;
            font-weight: 700;
        }
        #feedback-result-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            padding: 10px 6px;
            margin-bottom: 16px;
            border-top: 3px solid var(--lcd-0, #0f380f);
            border-bottom: 3px solid var(--lcd-0, #0f380f);
            font-weight: 700;
        }
        #feedback-result-stats span {
            display: block;
            font-size: 0.8rem;
            color: var(--lcd-1, #306230);
        }
        #feedback-result-stats strong {
            font-size: 1.25rem;
        }
        #feedback-result-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .feedback-modal-btn {
            padding: 8px 16px;
            background: var(--accent, #b5195c);
            color: #ffffff;
            border: 3px solid var(--ink, #1d1a2b);
            border-radius: 8px;
            box-shadow: 0 4px 0 var(--ink, #1d1a2b);
            font-family: inherit;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
        }
        .feedback-modal-btn.secondary {
            background: var(--shell, #d9d5e8);
            color: var(--ink, #1d1a2b);
        }
        .feedback-modal-btn:active {
            transform: translateY(3px);
            box-shadow: 0 1px 0 var(--ink, #1d1a2b);
        }
        #feedback-power-tooltip {
            position: fixed;
            z-index: 9998;
            display: none;
            max-width: 240px;
            padding: 8px 10px;
            background: var(--lcd-0, #0f380f);
            color: var(--lcd-3, #9bbc0f);
            border: 3px solid var(--ink, #1d1a2b);
            border-radius: 6px;
            box-shadow: 4px 4px 0 var(--ink, #1d1a2b);
            font-family: var(--font, "Pixelify Sans", "Courier New", monospace);
            font-size: 0.85rem;
            font-weight: 600;
            line-height: 1.25;
            pointer-events: none;
        }
        #feedback-power-tooltip.is-visible {
            display: block;
            animation: feedbackPulse 0.18s ease-out;
        }
    `;

    $('<style id="feedback-window-styles"></style>').text(css).appendTo('head');
}

function ensureResultModal() {
    if ($('#feedback-result-modal').length) {
        return;
    }

    const modalHtml = `
        <div id="feedback-result-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-result-title">
            <div id="feedback-result-card">
                <h2 id="feedback-result-title"></h2>
                <p id="feedback-result-subtitle"></p>
                <p id="feedback-result-best"></p>
                <div id="feedback-result-stats">
                    <div><span>Moves</span><strong id="feedback-stat-moves">0</strong></div>
                    <div><span>Combo</span><strong id="feedback-stat-combo">x0</strong></div>
                    <div><span>Pairs</span><strong id="feedback-stat-pairs">0/6</strong></div>
                </div>
                <div id="feedback-result-actions">
                    <button type="button" id="feedback-play-again-btn" class="feedback-modal-btn">Play Again</button>
                    <button type="button" id="feedback-close-modal-btn" class="feedback-modal-btn secondary">Close</button>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);

    $('#feedback-play-again-btn').on('click', function () {
        closeGameResultWindow();
        $('#play-button').trigger('click');
    });

    $('#feedback-close-modal-btn').on('click', function () {
        closeGameResultWindow();
    });
}

function ensurePowerTooltip() {
    if ($('#feedback-power-tooltip').length) {
        return;
    }

    $('body').append('<div id="feedback-power-tooltip" role="tooltip"></div>');
}

function getPowerUpDescription(selector) {
    const level = (typeof getSelectedDifficulty === 'function' ? getSelectedDifficulty() : $('input[name="difficulty"]:checked').val()) || 'easy';

    if (selector === '#freeze-button') {
        const freezeSec = typeof freezeTimes !== 'undefined' && freezeTimes[level] !== undefined
            ? freezeTimes[level]
            : (level === 'medium' ? 5 : level === 'hard' ? 3 : 10);
        return `Freeze: Pauses the timer for ${freezeSec}s (1 time use).`;
    }

    if (selector === '#hint-button') {
        return 'Hint: Select a card first, then highlights a row or column with its pair (1 time use).';
    }

    if (selector === '#peek-button') {
        return 'Peek: Briefly reveals unmatched cards so you can spot pairs (1 time use).';
    }

    return '';
}

function positionPowerTooltip($btn) {
    const $tip = $('#feedback-power-tooltip');
    if (!$btn || !$btn.length || !$tip.hasClass('is-visible')) return;

    const offset = $btn.offset();
    const btnWidth = $btn.outerWidth();
    const tipWidth = $tip.outerWidth();
    const tipHeight = $tip.outerHeight();
    const winWidth = $(window).width();

    let left = offset.left + (btnWidth / 2) - (tipWidth / 2);
    left = Math.max(8, Math.min(left, winWidth - tipWidth - 8));

    let top = offset.top - tipHeight - 10;
    if (top < 8) {
        top = offset.top + $btn.outerHeight() + 10;
    }

    $tip.css({ top: `${top}px`, left: `${left}px` });
}

function getCurrentGameStats() {
    return {
        moves: typeof moves !== 'undefined' ? moves : 0,
        combo: typeof combo !== 'undefined' ? combo : 0,
        matchedPairs: typeof correct !== 'undefined' ? correct : 0,
        totalPairs: typeof gameMode !== 'undefined' ? gameMode : 6
    };
}

// saves the fewest moves for each level (Easy, Medium, Hard have their own record)
function saveBestMoves(finalMoves) {
    const level = $('input[name="difficulty"]:checked').val() || 'easy';
    const key = 'flipquest-best-' + level;

    try {
        const oldBest = parseInt(localStorage.getItem(key), 10);

        if (isNaN(oldBest)) {
            localStorage.setItem(key, finalMoves);
            return 'First record saved!';
        }
        if (finalMoves < oldBest) {
            localStorage.setItem(key, finalMoves);
            return `New best! (was ${oldBest})`;
        }
        return `Best: ${oldBest} moves`;
    } catch (e) {
        return '';
    }
}

function openGameResultWindow(type, subtitleText) {
    ensureFeedbackStyles();
    ensureResultModal();

    const stats = getCurrentGameStats();
    const isWin = type === 'victory' || type === 'win';

    $('#feedback-result-title').text(isWin ? 'YOU WIN!' : 'TIME IS UP!');
    $('#feedback-result-subtitle').text(
        subtitleText || (isWin ? `Finished in ${stats.moves} moves.` : 'Out of time before matching all pairs.')
    );
    $('#feedback-stat-moves').text(stats.moves);
    $('#feedback-stat-combo').text(`x${stats.combo}`);
    $('#feedback-stat-pairs').text(`${stats.matchedPairs}/${stats.totalPairs}`);

    const alreadyOpen = $('#feedback-result-modal').hasClass('is-open');

    // only check the best score the first time the window opens
    if (!alreadyOpen) {
        $('#feedback-result-best').text(isWin ? saveBestMoves(stats.moves) : '');
    }

    $('#feedback-result-modal').addClass('is-open');
    $('#feedback-play-again-btn').trigger('focus');
}

function closeGameResultWindow() {
    $('#feedback-result-modal').removeClass('is-open');
}

function pulseElement($el) {
    if (!$el.length) return;
    $el.removeClass('stat-updated feedback-visible');
    void $el[0].offsetWidth;
    $el.addClass($el.is('#game-message') ? 'feedback-visible' : 'stat-updated');
}

function showGameMessage(message) {
    ensureFeedbackStyles();
    const $msg = $('#game-message').removeClass('result-victory result-gameover').text(message);
    pulseElement($msg);
}

function clearGameMessage() {
    $('#game-message').removeClass('result-victory result-gameover feedback-visible').text('');
}

function updateStatsDisplay(stats) {
    ensureFeedbackStyles();

    const currentMoves = stats && stats.moves !== undefined ? stats.moves : (typeof moves !== 'undefined' ? moves : 0);
    const currentCombo = stats && stats.combo !== undefined ? stats.combo : (typeof combo !== 'undefined' ? combo : 0);
    const currentMatched = stats && stats.matchedPairs !== undefined ? stats.matchedPairs : (typeof correct !== 'undefined' ? correct : 0);
    const currentTotal = stats && stats.totalPairs !== undefined ? stats.totalPairs : (typeof gameMode !== 'undefined' ? gameMode : 6);

    const prevMoves = $('#moves').text();
    const prevCombo = $('#combo').text();
    const prevMatched = $('#matched-pairs').text();

    $('#moves').text(currentMoves);
    $('#combo').text(`x${currentCombo}`);
    $('#matched-pairs').text(currentMatched);
    $('#total-pairs').text(currentTotal);

    if (prevMoves !== String(currentMoves)) pulseElement($('#moves'));
    if (prevCombo !== `x${currentCombo}`) pulseElement($('#combo'));
    if (prevMatched !== String(currentMatched)) pulseElement($('#matched-pairs'));
}

function showGameResult(result) {
    ensureFeedbackStyles();
    const $msg = $('#game-message').removeClass('result-victory result-gameover');
    const finalMoves = typeof moves !== 'undefined' ? moves : 0;

    if (result === 'victory' || result === 'win') {
        const winText = `You win! Finished in ${finalMoves} moves.`;
        $msg.addClass('result-victory').text(winText);
        pulseElement($msg);
        openGameResultWindow('victory', winText);
    } else if (result === 'game-over' || result === 'timeout') {
        const loseText = 'Time is up!';
        $msg.addClass('result-gameover').text(loseText);
        pulseElement($msg);
        openGameResultWindow('game-over', loseText);
    } else {
        $msg.text(String(result));
        pulseElement($msg);
    }
}

function attachFeedbackHooks() {
    if (typeof startGame === 'function' && !startGame._feedbackWrapped) {
        const originalStartGame = startGame;
        startGame = function (difficulty) {
            closeGameResultWindow();
            $('#timer, #time-limit').removeClass('time-low');
            const result = originalStartGame.apply(this, arguments);
            updateStatsDisplay(getCurrentGameStats());
            setTimeout(function () {
                showGameMessage('Find all the matching pairs!');
            }, 0);
            return result;
        };
        startGame._feedbackWrapped = true;
    }

    if (typeof handleCardClick === 'function' && !handleCardClick._feedbackWrapped) {
        const originalHandleCardClick = handleCardClick;
        handleCardClick = function (index) {
            const prevMoves = typeof moves !== 'undefined' ? moves : 0;
            const prevMatched = typeof correct !== 'undefined' ? correct : 0;
            const result = originalHandleCardClick.apply(this, arguments);
            const nextMoves = typeof moves !== 'undefined' ? moves : 0;
            const nextMatched = typeof correct !== 'undefined' ? correct : 0;

            updateStatsDisplay(getCurrentGameStats());

            const totalPairs = typeof gameMode !== 'undefined' ? gameMode : 6;

            // the win is already handled by the endGame hook below
            if (nextMatched >= totalPairs) {
                return result;
            }

             // game.js na ang nagse-set ng message (roast / combo),
            // kaya pulse animation na lang ang gagawin dito, hindi na papalitan ang text
            if (nextMoves > prevMoves) {
                setTimeout(function () {
                    pulseElement($('#game-message'));
                }, 0);
            }

            return result;
        };
        handleCardClick._feedbackWrapped = true;
    }

    if (typeof endGame === 'function' && !endGame._feedbackWrapped) {
        const originalEndGame = endGame;
        endGame = function (reason) {
            const result = originalEndGame.apply(this, arguments);
            updateStatsDisplay(getCurrentGameStats());
            $('#timer').removeClass('time-low');
            setTimeout(function () {
                if (reason === 'win') {
                    showGameResult('victory');
                } else {
                    showGameResult('game-over');
                }
            }, 0);
            return result;
        };
        endGame._feedbackWrapped = true;
    }
}

$(function () {
    ensureFeedbackStyles();
    ensureResultModal();
    ensurePowerTooltip();
    attachFeedbackHooks();
    updateStatsDisplay(getCurrentGameStats());

    let isHoveringPowerUp = false;
    let $activeHoverButton = null;

    // power-up hover: only the tooltip shows, the game message is left alone
    ['#freeze-button', '#hint-button', '#peek-button'].forEach(function (selector) {
        const $btn = $(selector);
        if (!$btn.length) return;

        $btn.on('mouseenter.feedback focus.feedback', function () {
            const desc = getPowerUpDescription(selector);
            if (!desc) return;

            isHoveringPowerUp = true;
            $activeHoverButton = $btn;

            const $tip = $('#feedback-power-tooltip').text(desc).addClass('is-visible');
            positionPowerTooltip($btn);
            $tip.addClass('is-visible');
        });

        $btn.on('mouseleave.feedback blur.feedback', function () {
            if ($activeHoverButton && $activeHoverButton[0] === this) {
                isHoveringPowerUp = false;
                $activeHoverButton = null;
                $('#feedback-power-tooltip').removeClass('is-visible');
            }
        });
    });

    $(window).on('resize.feedback', function () {
        if (isHoveringPowerUp && $activeHoverButton) {
            positionPowerTooltip($activeHoverButton);
        }
    });

    $('#hint-button').on('click.feedback', function () {
        const noCardSelected =
            (typeof firstCard === 'undefined' || firstCard === null) ||
            (typeof selectedHintCard !== 'undefined' && !selectedHintCard);

        if (noCardSelected) {
            setTimeout(function () {
                showGameMessage('Pick a card first, then press Hint.');
            }, 0);

            // put the normal message back after 2 seconds
            setTimeout(function () {
                if ($('#game-message').text() === 'Pick a card first, then press Hint.') {
                    showGameMessage('Find all the matching pairs!');
                }
            }, 2000);
        }
    });

    $('input[name="difficulty"]').on('change.feedback', function () {
        closeGameResultWindow();
        const level = $(this).val();
        const pairs = level === 'medium' ? 9 : level === 'hard' ? 12 : 6;
        updateStatsDisplay({ moves: 0, combo: 0, matchedPairs: 0, totalPairs: pairs });
        setTimeout(function () {
            showGameMessage('Difficulty changed. Press Play to start a new game.');
        }, 0);
    });

    
   // Warning kapag 10 seconds or less na lang ang limit
const limitEl = document.getElementById('time-limit');

if (limitEl) {

    new MutationObserver(function () {

        const seconds = Number(limitEl.textContent);

        $('#time-limit').toggleClass(
            'time-low',
            gameStarted && seconds > 0 && seconds <= 10
        );

    }).observe(limitEl, {
        childList: true,
        characterData: true,
        subtree: true
    });

}

    // Esc closes the result window
    $(document).on('keydown.feedback', function (e) {
        if (e.key === 'Escape' && $('#feedback-result-modal').hasClass('is-open')) {
            closeGameResultWindow();
        }
    });
});