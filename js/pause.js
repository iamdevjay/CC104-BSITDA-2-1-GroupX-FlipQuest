

(function () {   

    var paused = false;
    var waiting = [];        // flip backs muna card habang naka paused
    var openTimeouts = {};  
    var realSetInterval = window.setInterval;
    var realSetTimeout = window.setTimeout;
    var realClearTimeout = window.clearTimeout;

    //  1. respect the pause 

    // setInterval: while paused)
    window.setInterval = function (fn, delay) {
        if (typeof fn !== "function") return realSetInterval.apply(window, arguments);
        var extra = Array.prototype.slice.call(arguments, 2);
        return realSetInterval(function () {
            if (paused) return;
            fn.apply(window, extra);
        }, delay);
    };

    // setTimeout: if one finishes while paused (like cards flipping back),
    // we hold it and run it when the player resumes
    window.setTimeout = function (fn, delay) {
        if (typeof fn !== "function") return realSetTimeout.apply(window, arguments);
        var extra = Array.prototype.slice.call(arguments, 2);
        var id = realSetTimeout(function () {
            delete openTimeouts[id];
            var run = function () { fn.apply(window, extra); };
            if (paused) {
                waiting.push(run);
            } else {
                run();
            }
        }, delay);
        openTimeouts[id] = true;
        return id;
    };

    //  2. grab the things on the page 
    var overlay = document.getElementById("pause-overlay");
    var gameBox = document.querySelector(".game-container");
    var settingsBtn = document.getElementById("settings-button");
    var resumeBtn = document.getElementById("resume-button");
    var restartBtn = document.getElementById("restart-button");
    var playBtn = document.getElementById("play-button");

    //  3. pause, resume, restart 

    function pauseGame() {
        if (paused) return;
        paused = true;
        FlipSound.pauseMusic(); 
        overlay.hidden = false;
        gameBox.inert = true;   // block lahat ng pipindutin
        resumeBtn.focus();
    }

    function resumeGame() {
        if (!paused) return;
        paused = false;
        FlipSound.resumeMusic(); 
        overlay.hidden = true;
        gameBox.inert = false;
        settingsBtn.focus();

        // run anything that was waiting (like cards that need to flip back)
        var todo = waiting;
        waiting = [];
        for (var i = 0; i < todo.length; i++) {
            todo[i]();
        }
    }

    function restartGame() {
        // cancel flip-backs that were still counting down
        for (var id in openTimeouts) {
            realClearTimeout(Number(id));
        }
        openTimeouts = {};
        waiting = [];

        paused = false;
        overlay.hidden = true;
        gameBox.inert = false;

        // Restarting = same as pressing Play.
        // If your Play button does something different, call your own
        // start function here instead of the click.
        playBtn.disabled = false;
        playBtn.click();
    }

    //  4. hook up the buttons 
    settingsBtn.addEventListener("click", pauseGame);
    resumeBtn.addEventListener("click", resumeGame);
    restartBtn.addEventListener("click", restartGame);

    // Esc pauses, and Esc again resumes
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (paused) { resumeGame(); } else { pauseGame(); }
        }
    });

})();