// sounds.js
// Sound effects 
//   #sound-button = sound effects (SFX)

var FlipSound = (function () {


    // WALATO KASI WALAPANG MUSIC.
    var MUSIC_FILE = "";

    var sfxOn = true;          // sound effects on/off
    var musicOn = true;        // music on/off
    var VOLUME = 0.06;         // effects loudness: 0.03 = very quiet, 0.1 = louder
    var ctx = null;            // the audio engine (made on the first click)
    var musicStarted = false;
    var music = null;

    if (MUSIC_FILE) {
        music = new Audio(MUSIC_FILE);
        music.loop = true;
        music.volume = 0.25;
    }

    //  1. the beep maker 
    function getCtx() {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
        return ctx;
    }

    // pitch, start time (seconds), how long, wave shape
    function beep(freq, start, length, type) {
        if (!sfxOn) return;
        var c = getCtx();
        var osc = c.createOscillator();
        var vol = c.createGain();
        var t = c.currentTime + start;

        osc.type = type || "sine";
        osc.frequency.value = freq;

        vol.gain.setValueAtTime(0.0001, t);
        vol.gain.linearRampToValueAtTime(VOLUME, t + 0.02);        // soft start, no click
        vol.gain.exponentialRampToValueAtTime(0.0001, t + length); // slow, gentle fade

        osc.connect(vol);
        vol.connect(c.destination);
        osc.start(t);
        osc.stop(t + length + 0.05);
    }

    //  2. all the sound effects 
    var sfx = {
        flip:   function () { beep(440, 0, 0.09); },
        match:  function () { beep(659, 0, 0.25); beep(880, 0.12, 0.35); },
        wrong:  function () { beep(330, 0, 0.25); beep(262, 0.14, 0.35); },
        win:    function () { [523, 659, 784, 1047].forEach(function (f, i) { beep(f, i * 0.15, 0.45); }); },
        lose:   function () { [392, 330, 262].forEach(function (f, i) { beep(f, i * 0.22, 0.5); }); },
        play:   function () { beep(523, 0, 0.18); beep(784, 0.12, 0.3); },
        freeze: function () { beep(1047, 0, 0.3); beep(880, 0.1, 0.3); beep(784, 0.2, 0.4); },
        hint:   function () { beep(784, 0, 0.3); beep(988, 0.14, 0.4); },
        peek:   function () { beep(392, 0, 0.15); beep(494, 0.08, 0.15); beep(587, 0.16, 0.25); }
    };

    //  3. music 
    function playMusic() {
        if (music && musicOn && musicStarted) {
            music.play().catch(function () {});   // ignore if the browser blocks it
        }
    }

    function pauseMusic() {
        if (music) music.pause();
    }

    //  4. buttons 
    var playBtn = document.getElementById("play-button");
    playBtn.addEventListener("click", function () {
        musicStarted = true;
        playMusic();
        sfx.play();
    });

    document.getElementById("freeze-button").addEventListener("click", sfx.freeze);
    document.getElementById("peek-button").addEventListener("click", sfx.peek);

    // Hint: only make the sound if the hint really worked.
    // (Hint() disables the button when it works, so we check that.)
    var hintBtn = document.getElementById("hint-button");
    hintBtn.addEventListener("click", function () {
        setTimeout(function () {
            if (hintBtn.disabled) sfx.hint();
        }, 0);
    });

    // SFX button: only the sound effects
    var sfxBtn = document.getElementById("sound-button");
    sfxBtn.addEventListener("click", function () {
        sfxOn = !sfxOn;
        sfxBtn.classList.toggle("is-off", !sfxOn);
        sfxBtn.setAttribute("aria-pressed", sfxOn);
    });

    // Music button: only the music
    var musicBtn = document.getElementById("music-button");
    musicBtn.addEventListener("click", function () {
        musicOn = !musicOn;
        musicBtn.classList.toggle("is-off", !musicOn);
        musicBtn.setAttribute("aria-pressed", musicOn);
        if (musicOn) { playMusic(); } else { pauseMusic(); }
    });

    //  5. watching the game 

    // a) card flipped: play when a card gets the "is-flipped" class
    var cardWatcher = new MutationObserver(function (changes) {
        changes.forEach(function (c) {
            var before = c.oldValue || "";
            var now = c.target.className;
            if (before.indexOf("is-flipped") === -1 && now.indexOf("is-flipped") !== -1) {
                sfx.flip();
            }
        });
    });
    document.querySelectorAll(".card").forEach(function (card) {
        cardWatcher.observe(card, { attributes: true, attributeFilter: ["class"], attributeOldValue: true });
    });

    // b) match / wrong / win / lose: play from the message under the board
    var msg = document.getElementById("game-message");
    var msgWatcher = new MutationObserver(function () {
        var text = msg.textContent;
        if (text === "Match!") {
            sfx.match();
        } else if (text === "No match...") {
            sfx.wrong();
        } else if (text.indexOf("You win") === 0) {
            sfx.win();
        } else if (text === "Time is up!") {
            sfx.lose();
        }
    });
    msgWatcher.observe(msg, { childList: true, characterData: true, subtree: true });

    //  6. GAMIT NG PAUSE.JS
    return {
        pauseMusic: pauseMusic,
        resumeMusic: playMusic
    };

})();