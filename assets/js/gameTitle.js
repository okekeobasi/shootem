var gameTitle = function(game){}

var enter;

gameTitle.prototype = {
    create: function(){
        var style = {
            fill:'rgb(255, 255, 255)',
            backgroundColor: 'rgb(0, 0, 0)',
            wordWrap: true
        };
        var text = game.add.text(game.width / 2, game.height / 2, 
            "Shoot Em", style);
        text.anchor.set(0.5, 0.5);

        
        enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER)

        game.input.onDown.add(this.startGame, this);
    },

    update: function(){
        if(enter.isDown) this.startGame
    },

    startGame: function(){
        this.state.start("gameMain");
    }
}