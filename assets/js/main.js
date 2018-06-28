var game;
$(document).ready(function() {
    document.onkeydown = function (e) {
        // e.preventDefault();
        e = e || window.event;//Get event
        if (e.ctrlKey) {
            var c = e.which || e.keyCode;//Get key code
            console.log(c);
            switch (c) {
                case 83://Block Ctrl+S
                case 87://Block Ctrl+W --Not work in Chrome
                    e.preventDefault();
                    e.stopPropagation();
                case 32:
                    e.preventDefault();
                break;
            }
        }
    };
    game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'phaser-div');

    game.state.add("gameBoot", gameBoot);
    game.state.add("gamePreload", gamePreload);
    game.state.add("gameTitle", gameTitle);
    game.state.add("gameMain", gameMain);
    game.state.add("gameOver", gameOver);

    game.state.start("gameBoot");
})