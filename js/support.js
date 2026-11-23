
'use strict';

$(document).ready(function () {

    var gifAnimation = null;

    // Open Support the Creator popup
    $('#support-button').on('click', function () {

        $('#support-modal').addClass('is-open');

        // Start background music
        var music = $('#support-music')[0];

        if (music) {
            music.currentTime = 0;

            music.play().catch(function () {
                // Browser may block automatic playback
            });
        }

        // Start GIF movement
        startGifAnimation();
    });

    // Close Support the Creator popup
    $('#close-support').on('click', function () {

        $('#support-modal').removeClass('is-open');

        // Stop background music
        var music = $('#support-music')[0];

        if (music) {
            music.pause();
            music.currentTime = 0;
        }

        // Stop GIF movement
        if (gifAnimation) {
            cancelAnimationFrame(gifAnimation);
            gifAnimation = null;
        }

    });

    // Close popup when clicking outside the content
    $('#support-modal').on('click', function (event) {

        if (event.target === this) {
            $('#close-support').click();
        }

    });

    // DVD-style bouncing GIF animation
    function startGifAnimation() {

        var gifs = $('.floating-gif');
        var positions = [];

        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;

        gifs.each(function () {

            var gif = $(this);

            var width = gif.outerWidth();
            var height = gif.outerHeight();

            var x = Math.random() * Math.max(0, screenWidth - width);
            var y = Math.random() * Math.max(0, screenHeight - height);

            positions.push({
                element: this,
                x: x,
                y: y,
                speedX: 3 * (Math.random() < 0.5 ? -1 : 1),
                speedY: 3 * (Math.random() < 0.5 ? -1 : 1),
                width: width,
                height: height
            });

            // Apply starting position immediately
            $(this).css({
                left: x + 'px',
                top: y + 'px'
            });

        });

        // Prevent multiple animation loops
        if (gifAnimation) {
            cancelAnimationFrame(gifAnimation);
        }

        function animate() {

            screenWidth = window.innerWidth;
            screenHeight = window.innerHeight;

            positions.forEach(function (gif) {

                gif.x += gif.speedX;
                gif.y += gif.speedY;

                // Bounce off left and right edges
                if (gif.x <= 0 || gif.x + gif.width >= screenWidth) {
                    gif.speedX *= -1;
                }

                // Bounce off top and bottom edges
                if (gif.y <= 0 || gif.y + gif.height >= screenHeight) {
                    gif.speedY *= -1;
                }

                // Keep GIFs inside the screen
                gif.x = Math.max(0, Math.min(gif.x, screenWidth - gif.width));
                gif.y = Math.max(0, Math.min(gif.y, screenHeight - gif.height));

                // Update position
                $(gif.element).css({
                    left: gif.x + 'px',
                    top: gif.y + 'px'
                });

            });

            gifAnimation = requestAnimationFrame(animate);
        }

        animate();
    }

});
