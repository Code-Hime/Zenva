//create new scene
let gameScene = new Phaser.Scene('Game');

//initiate scene params
gameScene.init = function() {
    //player speed
    this.playerSpeed = 3;

    //enemy speed
    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 4.5;

    //boundaries
    this.enemyMinY = 80;
    this.enemyMaxY = 280;

    this.isTerminating = false;
};

//load assets
gameScene.preload = function() {
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/dragon.png');
    this.load.image('goal', 'assets/treasure.png');
};

//called once after preload ends 
gameScene.create = function() {
    //create bg sprite
    let bg = this.add.sprite(0, 0, 'background');

    //change origin to top-left corner
    bg.setOrigin(0,0);

    //create the player
    this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');

    //reducing size by 50%
    this.player.setScale(0.5);

    //add the goal
    this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal');

    //scale goal
    this.goal.setScale(0.6);

    //create enemies
    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 4,
        setXY: {
            x: 90,
            y: 100,
            stepX: 100,
            stepY: 20
        }
    });

    //setting scale to all group elements
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);

    //set flipX and speed
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
        //flip
        enemy.flipX = true;

        // set enemy speed
        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
        enemy.speed = dir * speed;

    }, this);
};

//this is called up to 60 times per second
gameScene.update = function(){

    if(this.isTerminating) return;

    //check for active input
    if(this.input.activePointer.isDown) {
        //player walks
        this.player.x += this.playerSpeed;
    }

    //treasure overlap check
    let playerRect = this.player.getBounds();
    let treasureRect = this.goal.getBounds();

    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
        console.log('Reached goal!');
    
        //restart the scene
        this.scene.restart();
        return;
    }

    //get enemies
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for(let i = 0; i < numEnemies; i++) {

        //enemy movement
        enemies[i].y += enemies[i].speed;

        // check we haven't passed min or max Y
        let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
        let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

        if(conditionUp || conditionDown){
            enemies[i].speed *= -1;
        }

        //check enemy collision
        let enemyRect = enemies[i].getBounds();

        if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
            console.log('Game Over!');
    
            return this.gameOver();
        }
    }
};

gameScene.gameOver = function() {

    //initiated game over sequence
    this.isTerminating = true;

    //add camera shake
    this.cameras.main.shake(500);

    //listen for event completion
    this.cameras.main.on('camerashakecomplete', function(camera, effect){
     
    //fade out
    this.cameras.main.fade(500);
    }, this);

    this.cameras.main.on('camerafadeoutcomplete', function(camera, effect){
        this.scene.restart();
    }, this);
}


//set config of game
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
};

//create a new game, pass the config
let game = new Phaser.Game(config);