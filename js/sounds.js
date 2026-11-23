// sounds.js
// Sound effects + music player
//   #sound-button = sound effects (SFX)
//   #music-button = play / pause music
//   #stop-button  = stop music (balik sa simula ng song)
//   #next-button  = next song

var FlipSound = (function () {

    // Background music files
    var MUSIC_TRACKS = {
        easy: [
            "assets/bgms/Easy1.mp3",
            "assets/bgms/Easy2.mp3",
            "assets/bgms/Easy3.mp3",
            "assets/bgms/Easy4.mp3"
        ],
        medium: [
            "assets/bgms/Medium1.mp3",
            "assets/bgms/Medium2.mp3",
            "assets/bgms/Medium3.mp3",
            "assets/bgms/Medium4.mp3"
        ],
        hard: [
            "assets/bgms/Hard1.mp3",
            "assets/bgms/Hard2.mp3",
            "assets/bgms/Hard3.mp3",
            "assets/bgms/Hard4.mp3"
        ]
    };

    var sfxOn = true;          // sound effects on/off
    var VOLUME = 0.06;         // effects loudness: 0.03 = very quiet, 0.1 = louder
    var ctx = null;            // the audio engine (made on the first click)

    var music = new Audio();
    music.loop = false;        // hindi na loop, kasi next song na pag tapos
    music.volume = 0.25;

    var currentTrackIndex = 0;
    var currentDifficulty = "easy";
    var musicState = "stopped";       // "playing", "paused" or "stopped"
    var autoStart = true;             // magsisimula ba ang music pag Play? (off kapag ni-stop/pause ng player)
    var resumeAfterPause = false;     // tumutugtog ba bago i-pause ng pause menu?
    var failedInARow = 0;             // para di mag-loop forever kapag walang file

    var musicBtn = document.getElementById("music-button");
    var stopBtn = document.getElementById("stop-button");
    var nextBtn = document.getElementById("next-button");

    // Get selected difficulty
    function getSelectedDifficulty() {
        var selected = document.querySelector('input[name="difficulty"]:checked');
        return selected ? selected.value : "easy";
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

    //  3. music player

    // ♫ may guhit kapag naka-pause o stop ang music
    function updateMusicButtons() {
        var playing = musicState === "playing";

        musicBtn.classList.toggle("is-off", !playing);
        musicBtn.setAttribute("aria-pressed", playing);
        musicBtn.title = playing ? "Pause music" : "Play music";
    }

    // load a song and play it
    function loadTrack(index) {
        currentTrackIndex = index;
        music.src = MUSIC_TRACKS[currentDifficulty][currentTrackIndex];

        musicState = "playing";
        music.play().catch(function () {
            musicState = "paused";          // hinarang ng browser
            updateMusicButtons();
        });
        updateMusicButtons();
    }

    // Start music with a random song (from the selected difficulty)
    function startRandomTrack() {
        currentDifficulty = getSelectedDifficulty();

        var tracks = MUSIC_TRACKS[currentDifficulty];

        loadTrack(Math.floor(Math.random() * tracks.length));
    }

    // Move to the next song (after the last song, balik sa una)
    function nextMusicTrack() {
        var difficulty = getSelectedDifficulty();

        if (difficulty !== currentDifficulty) {
            currentDifficulty = difficulty;
            currentTrackIndex = 0;
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % MUSIC_TRACKS[currentDifficulty].length;
        }

        loadTrack(currentTrackIndex);
    }

    // pag tapos ang song, next song na kusa
    music.addEventListener("ended", nextMusicTrack);

    // kapag hindi ma-load ang file (mali ang pangalan), skip. Titigil kapag lahat ay fail.
    music.addEventListener("error", function () {
        failedInARow++;
        if (failedInARow < MUSIC_TRACKS[currentDifficulty].length) {
            nextMusicTrack();
        } else {
            failedInARow = 0;
            musicState = "stopped";
            updateMusicButtons();
        }
    });
    music.addEventListener("playing", function () { failedInARow = 0; });


    // Stop background music kapag game over
function stopGameMusic() {

    music.pause();

    if (music.getAttribute("src")) {
        music.currentTime = 0;
    }

    musicState = "stopped";
    resumeAfterPause = false;

    updateMusicButtons();

}

    // Ginagamit ng pause.js: pause ang music kasama ng game, tapos ibalik
    function pauseMusic() {
        if (musicState === "playing" && !music.paused) {
            music.pause();
            resumeAfterPause = true;
        }
    }

    function resumeMusic() {
        if (resumeAfterPause) {
            resumeAfterPause = false;
            music.play().catch(function () {});
        }
    }

    //  4. buttons

    // Game Play button: simula ng music (maliban kung ni-stop ng player) + sound
    var playBtn = document.getElementById("play-button");
    playBtn.addEventListener("click", function () {
        resumeAfterPause = false;      // kasama ang Restart ng pause menu, kasi nagki-click yun ng Play
        if (autoStart) startRandomTrack();
        sfx.play();
    });

    // Pag nagpalit ng difficulty: ihinto ang music, para sa bagong level ang susunod na song
    document.querySelectorAll('input[name="difficulty"]').forEach(function (radio) {
        radio.addEventListener("change", function () {
            currentDifficulty = getSelectedDifficulty();
            currentTrackIndex = 0;

            music.pause();
            music.removeAttribute("src");
            music.load();
            musicState = "stopped";
            resumeAfterPause = false;
            updateMusicButtons();
        });
    });

    // ♫ = play / pause
    musicBtn.addEventListener("click", function () {
        resumeAfterPause = false;

        if (musicState === "playing") {
            music.pause();
            musicState = "paused";
            autoStart = false;
        } else {
            autoStart = true;

            if (music.getAttribute("src")) {
                musicState = "playing";            // ituloy kung saan huminto
                music.play().catch(function () {});
            } else {
                startRandomTrack();
            }
        }
        updateMusicButtons();
    });

    // ■ = stop, balik sa simula ng song
    stopBtn.addEventListener("click", function () {
        music.pause();
        if (music.getAttribute("src")) music.currentTime = 0;
        musicState = "stopped";
        autoStart = false;
        resumeAfterPause = false;
        updateMusicButtons();
    });

    // » = next song
    nextBtn.addEventListener("click", function () {
        autoStart = true;
        resumeAfterPause = false;

        if (music.getAttribute("src")) {
            nextMusicTrack();
        } else {
            startRandomTrack();
        }
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
    var lastText = "";
    var lastTime = 0;
    var msgWatcher = new MutationObserver(function () {
        var text = msg.textContent;
        var now = Date.now();

        // iwas double sound kapag dalawang file ang nag-set ng parehong message
        if (text === lastText && now - lastTime < 300) return;
        lastText = text;
        lastTime = now;

        if (text === "Match!") {
            sfx.match();
        } else if (text === "No match...") {
            sfx.wrong();
        } else if (text.indexOf("You win") === 0) {
            stopGameMusic();
            sfx.win();
        } else if (text === "Time is up!") {
         stopGameMusic();
        sfx.lose();
        }
    });
    msgWatcher.observe(msg, { childList: true, characterData: true, subtree: true });

    updateMusicButtons();

    //  6. GAMIT NG PAUSE.JS
    return {
        pauseMusic: pauseMusic,
        resumeMusic: resumeMusic
    };

})();