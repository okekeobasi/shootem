var gameMain = function(game){}

var pause_label_width = 0;
var pause_label_height = 0;
var game_width = 0;
var game_height = 0;
var camera_x = 0;
var camera_y = 0;
var esc_down;

var SpawnRate = 2;
var enemySpeed = 25;
var enemyRadar = 0.5;
var enemyPool;
// var enemy;

var powerUps;
var powerUps_spawnRate = 10;

var dustGroup;
var dustFrameRate = 50;

var explosionGroup;
var explosionFrameRate = 50;

var cursor;
var crosshair_speed = 500;
var fireRate = 800;
var nextFire = 0;
var capacity = 1000000;
var currentRound = 0;
var bullets;
var bullet;
var bulletSpread = 1;
var bulletSpeed = 700;
var hyperBulletSpeed = 1700
var weapon_name = "SINGLE-BARREL";
var weapon_label;
var weapon_id = 2;

var life_label;
var lives = 5;
var lives_reduction_timer = 1000
var next_life_reduction = 0;
var life_string = "LIVES: " + lives;

var killCount = 0;
var prev_killCount = killCount;
var kill_label;
var kill_string = "KILLS: " + killCount;

var escape_key;
var menuText;

var spawnLocations = {
    0: [160, 128],
    1: [160, 348],
    2: [1020, 348],
    3: [990, 192],
    4: [640, 160],
    5: [640, 348]
}

var weapons = {
//  id: [fireRate, capacity, bulletSpread, name, key]
    0: [100, 300, 1, 'AK-47', 'ak-47'],
    1: [200, 200, 1, 'MICRO-SMG', 'micro-smg'],
    2: [600, 1000000, 1, 'SINGLE-BARREL', 'single-barrel'],
    3: [400, 200, 3, 'DOUBLE-BARREL', 'double-barrel']
}

var powerUpList = [];

gameMain.prototype = {
    create: function(){

        // Map and game size 
        map = game.add.tilemap('levelmap');
        game_width = map.widthInPixels
        game_height = map.heightInPixels

        game.scale.setGameSize(map.widthInPixels/1.2, map.heightInPixels/1.2);
        game.scale.setGameSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

        game.world.setBounds(0,0,game_width,game_height);
        map.addTilesetImage('levelset','sheet2');
        groundLayer = map.createLayer('Tile Layer 1');
        fernLayer = map.createLayer('Tile Layer 2');
        highLayer = map.createLayer('Tile Layer 3');

        groundLayer.renderSettings.enableScrollDelta = true;
        fernLayer.renderSettings.enableScrollDelta = true;
        highLayer.renderSettings.enableScrollDelta = true;

        map.setCollision([122,3221225594], true, groundLayer);
        map.setCollision([82,83], true, fernLayer);
        map.setCollisionBetween(132,136, true, fernLayer);
        map.setCollision([28,29,30,86,87,115,197,128,129,207,225,241], true, highLayer);

        groundLayer.resizeWorld();

        // Player
        player = game.add.sprite(game_width/2, game_height/2, 'player2');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.animations.add('down',[0,1,2,3],10,true);
        player.animations.add('up',[4,5,6,7],10,true);
        player.animations.add('left',[8,9,10,11],10,true);
        player.animations.add('right',[12,13,14,15],10,true);
        // player.animations.add('idle',[16,17,18,19],10,true);
        player.anchor.setTo(0.5, 0.5)
        game.camera.follow(player);


        //Enemy
        enemyPool = game.add.group();
        enemyPool.enableBody = true;
        enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
        enemyPool.createMultiple(100, 'baddie');
        enemyPool.setAll('checkWorldBounds', true);
        enemyPool.setAll('outOfBoundsKill', true);
        // Set the animation for each sprite
        enemyPool.forEach(function (enemy) {
            enemy.animations.add('down',[0,1,2,3],10,true);
            enemy.animations.add('up',[4,5,6,7],10,true);
            enemy.animations.add('left',[8,9,10,11],10,true);
            enemy.animations.add('right',[12,13,14,15],10,true);
        });
        // enemyPool.forEach(this.enemyMovement, this)

        //PowerUps
        powerUps = game.add.group();
        powerUps.enableBody = true;
        powerUps.physicsBodyType = Phaser.Physics.ARCADE;
        powerUps.createMultiple(100, ['single-barrel','double-barrel','ak-47','micro-smg']);
        powerUps.setAll('checkWorldBounds', true);
        powerUps.setAll('outOfBoundsKill', true);


        //Bullets
        bullets = game.add.group();
        bullets.createMultiple(100, 'bullet');
        game.physics.arcade.enable(bullets);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        //Crosshair
        crosshair = game.add.sprite(game.world.centerX, game.world.centerY, 'crosshair');
        game.physics.arcade.enable(crosshair);
        crosshair.body.collideWorldBounds = true;
        crosshair.inputEnabled = true;
        crosshair.anchor.setTo(0.5, 0.5);
        // game.camera.follow(player);

        //Cloud dust shown
        dustGroup = game.add.group();
        dustGroup.createMultiple(100, 'dust');
        dustGroup.setAll('checkWorldBounds', true);
        dustGroup.setAll('outOfBoundsKill', true);
        // Animations for each sprite
        dustGroup.forEach(function (dust){
            dust.animations.add('poof', [0,1,2,3,4,5,6,7,8,9,10,11,12], dustFrameRate, false);
        });

        //Cloud dust shown
        explosionGroup = game.add.group();
        explosionGroup.createMultiple(100, 'explosion');
        explosionGroup.setAll('checkWorldBounds', true);
        explosionGroup.setAll('outOfBoundsKill', true);
        // Animations for each sprite
        explosionGroup.forEach(function (explosion){
            explosion.animations.add('boom', [0,1,2,3,4,5], explosionFrameRate, false);
        });

        //labelGroup HUD
        labels = game.add.group();

        // Pause Menu
        pause_label_width = (game.camera.x + (game_width/1.2) - 120)
        pause_label_height = game.camera.y + (game_height/2)

        pause_label = game.add.text(pause_label_width, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
        pause_label.inputEnabled = true;
        // pause_label.fixedToCamera = true;
        pause_label.events.onInputUp.add(function () {
            // When the paus button is pressed, we pause the game
            game.paused = true;
    
            // Then add the menu
            menu = game.add.sprite(game.camera.x + (game.width/2.5), game.camera.y + (game.height/2.5), 'pause');
            menu.scale.setTo(0.1,0.1);
            menu.fixedToCamera = true
            menu.cameraOffset.setTo(0.5,0.5)
            // menu.anchor.setTo(0.5, 0.5);
        });

        pause_label.fixedToCamera = true;
        pause_label.cameraOffset.setTo(pause_label_width, 20);

        escape_key = game.input.keyboard.addKey(Phaser.Keyboard.ESC)

        // life Label
        life_label = game.add.text(
            64, 20, life_string + "\n" + kill_string, 
            { font: '24px Arial', fill: '#ff3333', fontWeight: 'bold', backgroundColor: 'rgb(0, 0, 0)' }
        );
        life_label.fixedToCamera = true;
        life_label.alpha = 0.5;
        life_label.cameraOffset.setTo(64, 20);

        // WEAPON HUD
        weapon_label = game.add.text(
            game.width - 100, game.height - 150, weapon_name + "\n" + currentRound + "/" + capacity, 
            { font: '24px Arial', fill: '#ff3333', fontWeight: 'bold' , backgroundColor: 'rgb(0, 0, 0)'}
        )
        weapon_label.fixedToCamera = true;
        weapon_label.alpha = 0.5;
        weapon_label.cameraOffset.setTo( game.width - 250, game.height - 150)

        // console.log(w);

        // camera properties
        camera_x = Math.round(player.x) - Math.round((game_width/4))
        camera_y = Math.round(player.y) - Math.round((game_height/4))

        game.time.events.loop(Phaser.Timer.SECOND * SpawnRate, this.spawnEnemy, this);
        game.time.events.loop(Phaser.Timer.SECOND * enemyRadar, this.enemyMovement, this);
        game.time.events.loop(Phaser.Timer.SECOND * powerUps_spawnRate, this.spawnPowerUp, this);

        game.world.bringToTop(highLayer);

        labels.add(life_label);
        labels.add(pause_label);
        labels.add(weapon_label);

        game.world.bringToTop(labels);
        // game.camera.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
    },

    update: function(){
        this.playerMovement();
        game.physics.arcade.collide(player, groundLayer);
        game.physics.arcade.collide(player, fernLayer);
        game.physics.arcade.collide(player, highLayer);

        game.physics.arcade.collide(enemyPool, groundLayer);
        game.physics.arcade.collide(enemyPool, fernLayer);
        game.physics.arcade.collide(enemyPool, highLayer);
        game.physics.arcade.collide(enemyPool)
        
        game.physics.arcade.overlap(player, enemyPool, this.enemyPlayerHandler, null, this);
        game.physics.arcade.collide(player, enemyPool);

        game.physics.arcade.collide(enemyPool, bullets, this.bulletKill, null, this)
        game.physics.arcade.overlap(enemyPool, bullets, this.bulletKill, null, this)
        
        game.physics.arcade.overlap(player, powerUps, this.setBulletConfig, null, this)

        game.physics.arcade.collide(groundLayer, bullets,  this.layerDestroyBullet, null, this);
        game.physics.arcade.collide(fernLayer, bullets,  this.layerDestroyBullet, null, this);
        game.physics.arcade.collide(highLayer, bullets,  this.layerDestroyBullet, null, this);

        // Add a input listener that can help us return from being paused
        game.input.onDown.add(this.unpause, self);

        // this.configureCamera();
        this.shoot()
        this.moveCrosshair();
        this.checkBullets();

        this.keyListeners()
    },

    pauseGame: function () {
        // When the paus button is pressed, we pause the game
        game.paused = true;

        // Then add the menu
        menu = game.add.sprite(game.camera.x + (game.width/2.5), game.camera.y + (game.height/2.5), 'pause');
        menu.scale.setTo(0.1,0.1);
        menu.fixedToCamera = true
        menu.cameraOffset.setTo(0.5,0.5)
        // menu.anchor.setTo(0.5, 0.5);

        this.setMenuText()
    },

    unpause: function(event){
        // Only act if paused
        if(game.paused){
            // Calculate the corners of the menu        
            // Remove the menu and the label
            menu.destroy();
            if(esc_down == true) menuText.destroy();
            // Unpause the game
            game.paused = false;
            esc_down = false;
        }
    },

    setMenuText: function(){
        menuText = game.add.text(game_width/2, game_height/2, 'Click to Resume', {font: '24px Arial', fill: '#fff', fontWeight: 'bold' });
        menuText.anchor.setTo(0.5, 0.5);
        esc_down = true;
    },

    keyListeners: function(){
        // this.input.keyboard.isDown(Phaser.Keyboard.Z)
        if(escape_key.isDown){
            // console.log(game.paused)
            if(game.paused == false) this.pauseGame();
        }
    },

    configureCamera: function(){
        camera_x = Math.round(player.x) - Math.round((game_width/4))
        camera_y = Math.round(player.y) - Math.round((game_height/4))
        game.camera.setPosition(camera_x, camera_y)

        game.camera.x = game.input.mousePointer.x
        game.camera.y = game.input.mousePointer.y
        // console.log(camera_x, camera_y)
    },

    playerMovement: function(){
        //game.physics.arcade.moveToObject(enemy,player,60,enemyspeed*1000);
        WASD = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        }

        player.body.velocity.setTo(0, 0);
        if(WASD.left.isDown){
            // game.camera.x -= 40;
            // game.camera.x = Math.abs(player.x)
            player.body.velocity.x = -150;
            player.animations.play('left')
        }
        else if(WASD.right.isDown){
            // game.camera.x += 40;
            // game.camera.x = Math.abs(player.x)
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
        else if(WASD.up.isDown){
            // game.camera.y -= 40;
            player.body.velocity.y = -150;
            player.animations.play('up');
        }
        else if(WASD.down.isDown){
            // game.camera.y += 40;
            player.body.velocity.y = 150;
            player.animations.play('down');
        }
        else{
            player.animations.stop();
            player.frame = 0;
        }
    },

    enemyMovement: function(){
        enemyPool.forEach(function(baddie){
            baddie.body.velocity.setTo(0, 0);
            if((Math.abs(Math.floor(player.x) - Math.floor(baddie.x)) == 0) && 
                (Math.abs(Math.floor(player.y) - Math.floor(baddie.y)) == 0))
            {
                baddie.animations.stop();
                baddie.frame = 0;
            }
            else{
                if(Math.floor(player.x) > Math.floor(baddie.x)){
                    baddie.body.velocity.x = enemySpeed
                    baddie.animations.play('right');
                }
                else if(Math.floor(player.x) < Math.floor(baddie.x)){
                    baddie.body.velocity.x = -enemySpeed
                    baddie.animations.play('left');
                }
                
                if(Math.floor(player.y) < Math.floor(baddie.y)){
                    baddie.body.velocity.y = -enemySpeed
                    baddie.animations.play('up');
                }
                else if(Math.floor(player.y) > Math.floor(baddie.y)){
                    baddie.body.velocity.y = enemySpeed
                    baddie.animations.play('down');
                }
            }
        });
    },

    spawnEnemy: function(spawnInst){
        var rand = game.rnd.integerInRange(0, 5);
        // console.log(rand)
        if(spawnInst = 0){
            width = spawnLocations[rand][0]
            height = spawnLocations[rand][1]
        }
        else{
            width = game.rnd.integerInRange(100, game_width);
            height = game.rnd.integerInRange(200, game_height - 200);
        }

        this.showDust(width, height);

        enemy = enemyPool.getFirstExists(false);
        enemy.reset(width, height);
        enemy.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(enemy)
        this.enemyMovement();
    },

    spawnPowerUp: function(){
        var width = game.rnd.integerInRange(100, game_width);
        var height = game.rnd.integerInRange(200, game_height - 200);

        if(powerUps.countLiving() < 3){
            i = game.rnd.integerInRange(0, Object.keys(weapons).length - 1)
            // console.log(i)
            powerUp = powerUps.getFirstExists(false, false, width, height, weapons[i][4]);
            powerUp.anchor.setTo(0.5,0.5);
            // powerUp.scale.setTo(2,2);
            game.physics.arcade.enable(powerUp);

            weapon_id = i;
        }
    },

    setBulletConfig: function(guy, powerUp){
        for(var i = 0; i < Object.keys(weapons).length; i++){
            if(powerUp.key == weapons[i][4]){
                fireRate = weapons[i][0];
                capacity = weapons[i][1];
                bulletSpread = weapons[i][2];
                weapon_name = weapons[i][3];
                currentRound = 0;
                weapon_label.text = weapon_name + "\n" + currentRound + "/" + capacity;  
            }
        }
        // console.log(powerUp.key);
        powerUp.destroy();
    },

    showDust: function(w, h){
        dust = dustGroup.getFirstExists(false);
        dust.reset(w, h);
        dust.anchor.setTo(0.5, 0.5);
        dust.animations.play('poof', dustFrameRate, false, true);
    },

    enemyPlayerHandler: function(){        
        if(next_life_reduction < game.time.now){
            next_life_reduction = lives_reduction_timer + game.time.now
            this.updateLivesLabel()       
        }
        // console.log("lives:", lives);
    },

    bulletKill: function(enemy, bullet) {
        this.destroyBullet(enemy, bullet);
        enemy.kill();
        this.updateKillLabel();
    },

    destroyBullet: function(enemy, bullet) {        
        this.playExplosion(enemy.x, enemy.y);
        // bullets.callAll('kill');
        bullet.kill();
        /*
        bullets.forEach(function(bullet){
            if((bullet.body.velocity.x + bullet.body.velocity.y) < 5) bullet.kill();
        })
        */
    },

    layerDestroyBullet: function(layer, bullet){
        bullet.kill();
    },

    checkBullets: function(){
        //
    },

    playExplosion: function(w, h){
        explosion = explosionGroup.getFirstExists(false);
        explosion.reset(w, h);
        explosion.anchor.setTo(0.5, 0.5);
        explosion.animations.play('boom', explosionFrameRate, false, true);
    },

    moveCrosshair: function(){
        cursor = game.input.keyboard.createCursorKeys();
        crosshair.body.velocity.setTo(0, 0);
        crosshair.body.angularVelocity = 0;

        if(cursor.left.isDown){
            crosshair.body.velocity.x = -crosshair_speed;
        }
        if(cursor.right.isDown){
            crosshair.body.velocity.x = crosshair_speed;
        }
        if(cursor.up.isDown){
            crosshair.body.velocity.y = -crosshair_speed;
        }
        if(cursor.down.isDown){
            crosshair.body.velocity.y = crosshair_speed;
        }
    },

    manageWeaponRounds: function(){
        if(currentRound < capacity){
            currentRound++;
        }

        weapon_label.text = weapon_name + "\n" + currentRound + "/" + capacity
    },

    shoot: function(){
        if(currentRound < capacity){
            if (game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown)
            {
                this.cursorFire();
            }
            else if(game.input.activePointer.isDown){
                this.mouseFire();
            }
        }
    },

    cursorFire: function() {
        if (game.time.now > nextFire && bullets.countDead() > 0)
        {
            this.manageWeaponRounds();
            for(var i = 0; i < bulletSpread; i++){
                nextFire = game.time.now + fireRate;
                var bullet = bullets.getFirstDead();
                bullet.scale.setTo(0.5,0.5);
                bullet.reset(player.x, player.y);
                if(bulletSpread != 1) angle = 0.5 * (i * 3);
                else angle = 0.5;
                bullet.anchor.setTo(angle, angle);
                game.physics.arcade.moveToObject(bullet, crosshair, bulletSpeed);
            }
        }
    },

    mouseFire: function() {
        if (game.time.now > nextFire && bullets.countDead() > 0)
        {
            this.manageWeaponRounds();
            for(var i = 0; i < bulletSpread; i++){
                nextFire = game.time.now + fireRate;
                var bullet = bullets.getFirstDead();
                bullet.scale.setTo(0.5,0.5);
                bullet.reset(player.x, player.y);
                if(bulletSpread != 1) angle = 0.5 * (i * 3);
                else angle = 0.5;
                bullet.anchor.setTo(angle, angle);
                game.physics.arcade.moveToPointer(bullet, bulletSpeed);
            }
        }
    },

    updateLivesLabel: function(){
        lives--;
        life_string = "LIVES: " + lives;
        life_label.text = life_string + "\n" + kill_string;
    },

    updateKillLabel: function(){
        killCount++;
        kill_string = "KILLS: " + killCount
        life_label.text = life_string + "\n" + kill_string;
        
        if(killCount > (prev_killCount + 10)){
            enemySpeed += 0.5;
            SpawnRate -= 0.05;
            this.spawnEnemy(1);
        }
    }
}