var gamePreload = function(game){}

gamePreload.prototype = {
    preload: function(){
        game.load.image("pause","assets/img/pause.png")
        game.load.image("sheet2","assets/img/sheet2.png")
        // game.load.image("bullet", "assets/img/bullet.png")
        game.load.image("bullet", "assets/img/round_bullet.png")
        game.load.image("crosshair", "assets/img/crosshair.png")

        game.load.image("single-barrel", "assets/img/single-barrel.png")
        game.load.image("double-barrel", "assets/img/double-barrel.png")
        game.load.image("ak-47", "assets/img/ak-47.png")
        game.load.image("micro-smg", "assets/img/micro-smg.png")

        game.load.tilemap('levelmap','assets/tiles/largelevelmap.json', null, Phaser.Tilemap.TILED_JSON);
        
        game.load.spritesheet('dust','assets/img/wind_dust_row.png',32,32);
        game.load.spritesheet('explosion','assets/img/explosion_trans.png',32,32);
        game.load.spritesheet('baddie','assets/img/baddie.png',32,32);
        game.load.spritesheet('player','assets/img/actor2.png',32,32);
        game.load.spritesheet('player2','assets/img/colored_actor.png',32,32);
        game.load.spritesheet('player3','assets/img/jacketguy.png',40,66);

        game.add.plugin(Phaser.Plugin.Debug);
    },

    create: function(){
        this.state.start("gameTitle");
    }
}