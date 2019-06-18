var gameBoot = function(game){}

gameBoot.prototype = {
    preload: function(){},
    create: function(){
        
        this.scale.scaleMode = Phaser.ScaleManager.aspectRatio;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.updateLayout(true);
        this.stage.backgroundColor = '#ded';

        this.state.start("gamePreload");
    }
}