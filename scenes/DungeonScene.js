// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

//import Enemy from "/scenes/Enemy.js"

export default class Game extends Phaser.Scene {

  constructor() {
    super("game");
  }

  preload() {
    this.load.tilemapTiledJSON("Mazmorra", "tiles/Mazmorra2(mejorada).json");
    this.load.image("tiles", "tiles/Dungeon_tiles - copia.png");
    this.load.atlas("faune", "character/Atlas.png", "character/Atlas.json");
    this.load.atlas("lizard", "enemy/lizard.png", "enemy/lizard.json");
    this.load.atlas("coins", "tiles/spritesheet.png", "tiles/spritesheet.json");
    
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  
  
  create() {
    
    const map = this.make.tilemap({ key: "Mazmorra" });
    const tiles = map.addTilesetImage("Dungeon_tiles", "tiles");
    

    const LayerAbajo = map.createLayer("Piso", tiles, 0, 0);
    const LayerArriba = map.createLayer("Paredes", tiles, 0, 0);
    LayerArriba.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    LayerArriba.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    

    this.lizard = this.physics.add.sprite(250, 128, "lizard", "lizard_m_idle_anim_f0.png");
    this.lizard.body.setSize(this.lizard.width * 0.9, this.lizard.height * 0.6);
    this.physics.add.collider(this.lizard, LayerArriba); 
    
    this.faune = this.physics.add.sprite(108, 128, "faune", "sprites/run-down/run-down-6.png");
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);
    

    this.anims.create({
      key: "faune-idle-down",
      frames: [{ key: "faune", frame: "sprites/walk-down/walk-down-3.png"}]
    });

    this.anims.create({
      key: "faune-idle-up",
      frames: [{ key: "faune", frame: "sprites/walk-up/walk-up-3.png"}]
    });

    this.anims.create({
      key: "faune-idle-side",
      frames: [{ key: "faune", frame: "sprites/walk-side/walk-side-3.png"}]
    });

    this.anims.create({
      key: "faune-run-down",
      frames: this.anims.generateFrameNames("faune", { start: 1, end: 8, prefix: "sprites/run-down/run-down-", suffix: ".png"}),
      repeat: -1,
      frameRate: 15
    });

    this.anims.create({
      key: "faune-run-up",
      frames: this.anims.generateFrameNames("faune", { start: 1, end: 8, prefix: "sprites/run-up/run-up-", suffix: ".png"}),
      repeat: -1,
      frameRate: 15
    });

    this.anims.create({
      key: "faune-run-side",
      frames: this.anims.generateFrameNames("faune", { start: 1, end: 8, prefix: "sprites/run-side/run-side-", suffix: ".png"}),
      repeat: -1,
      frameRate: 15
    });
    
    this.faune.anims.play("faune-idle-down");

    this.physics.add.collider(this.faune, LayerArriba);
    this.cameras.main.startFollow(this.faune, true);

    this.time.addEvent({
      delay: 1000, // Cada segundo
      loop: true,
      callback: this.seguimiento,
      callbackScope: this
    });

    const coins = map.getObjectLayer("elements")?.objects;
    this.coinsGroup = this.physics.add.group();
    coins.forEach(coin => {
      const newCoin = this.coinsGroup.create(coin.x, coin.y, "coins", "coins");
    })
    this.physics.add.collider(this.faune, this.coinsGroup, this.collectCoin, null, this);
   
  }

 
  
  seguimiento(){
    const player = this.faune;
    const enemy = this.lizard;
  
    const angleToPlayer = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    this.physics.velocityFromRotation(angleToPlayer, 50, enemy.body.velocity);
  }

  update(){
    const speed = 100
    if(!this.cursors || !this.faune){
      return
    }
    if (this.cursors.left?.isDown) {
      this.faune.setVelocity(-speed, 0);
      this.faune.anims.play("faune-run-side", true);
      this.faune.scaleX = -1;
      this.faune.body.offset.x = 24;
    } else if (this.cursors.right?.isDown) {
      this.faune.setVelocity(speed, 0);
      this.faune.anims.play("faune-run-side", true);
      this.faune.scaleX = 1;
      this.faune.body.offset.x = 8;
    } else if (this.cursors.up?.isDown) {
      this.faune.setVelocity(0, -speed);
      this.faune.anims.play("faune-run-up", true);
    } else if (this.cursors.down?.isDown) {
      this.faune.setVelocity(0, speed);
      this.faune.anims.play("faune-run-down", true);
    } else {
      this.faune.setVelocity(0, 0);
      const currentDirection = this.faune.anims.currentAnim?.key;
      if (currentDirection) {
        const direction = currentDirection.split("-")[2];
        this.faune.anims.play(`faune-idle-${direction}`, true);
      }
    }

    
    
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true); // Desactiva el cuerpo de la moneda para que desaparezca
    // Agrega puntos o realiza otras acciones de recolección aquí
  }

  
}