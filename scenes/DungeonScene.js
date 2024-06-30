// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

//import Enemy from "/scenes/Enemy.js"

export default class Game extends Phaser.Scene {

  constructor() {
    super("game");
    this.score = 0;

  }

  preload() {
    //cargar JSON de la mazmorra, tileset de la mazmorra y atlas de personajes, enemigos y objetos
    this.load.tilemapTiledJSON("Mazmorra", "tiles/8bits.json");
    this.load.image("tiles", "tiles/tileset(pruebaFinal).png");
    this.load.atlas("faune", "character/Atlas.png", "character/Atlas.json");
    this.load.atlas("lizard", "enemy/lizard.png", "enemy/lizard.json");
    this.load.atlas("coins", "tiles/spritesheet.png", "tiles/spritesheet.json");
    
    //cursores para el movimiento
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  
  
  create() {
    //variables que definen el tilemap(archivo JSON) y el tileset
    const map = this.make.tilemap({ key: "Mazmorra" });
    const tiles = map.addTilesetImage("tileset(pruebaFinal)", "tiles");
    //definir personaje como player
    const player = this.faune;
    //definir layers del archivo json
    const LayerAbajo = map.createLayer("Piso", tiles, 0, 0);
    const LayerArriba = map.createLayer("Paredes", tiles, 0, 0);
    //a traves de una propiedad booleana, generamos colision con las tiles deseadas
    LayerArriba.setCollisionByProperty({ colliders: true });
    //codigo usado solo para mostrar la caja de colisiones de las tiles
    
    //se define el sprite, tamaño y collisiones del enemigo
    this.lizard = this.physics.add.sprite(250, 128, "lizard", "lizard_m_idle_anim_f0.png");
    this.lizard.body.setSize(this.lizard.width * 0.9, this.lizard.height * 0.6);
    this.physics.add.collider(this.lizard, LayerArriba); 
    //se define el sprite y tamaño del player, ademas de su colision y que la camara lo siga
    this.faune = this.physics.add.sprite(108, 128, "faune", "sprites/run-down/run-down-6.png");
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);
    this.physics.add.collider(this.faune, LayerArriba);
    this.cameras.main.startFollow(this.faune, true);
    //texto para mostrar el puntaje
    this.scoreText = this.add.text(16, 16, 'Puntuación: 0', { fontSize: '20px', fill: '#fff' });
    this.scoreText.setScrollFactor(0); 
    //animaciones player
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
    //evento del enemigo siguiendo al player
    this.time.addEvent({
      delay: 1000, // Cada segundo
      loop: true,
      callback: this.seguimiento,
      callbackScope: this
    });
    //definimos donde aparecen las monedas, les generamos un grupo con fisicas y las generamos en el mapa
    const coins = map.getObjectLayer("elements")?.objects;
    this.coinsGroup = this.physics.add.group();
    coins.forEach(coin => {
      
      const newCoin = this.coinsGroup.create(coin.x, coin.y, "coins", 0);
      
    });
    //definimos colision entre player y las monedas, ademas de la funcion que llama al interactuar
    this.physics.add.collider(this.faune, this.coinsGroup, this.collectCoin, null, this);
    //animacion moneda
    this.anims.create({
      key: "money",
      frames: this.anims.generateFrameNames("coins", { start: 0, end: 5, prefix: "pixil-frame-", suffix: ".png"}),
      repeat: -1
    });

    this.coinsGroup.children.iterate(coin => {
      coin.anims.play("money", true);
    });
    //se definen como array las znas para teletransporte y las de aparecer, ademas de buscar tile por tile las que tengan esas mismas propiedades
    this.teleportZones = [];
    this.appearZones = [];

    const renderTexture = this.add.renderTexture(0, 0, map.widthInPixels, map.heightInPixels);
    renderTexture.setPipeline('Light2D');
    renderTexture.draw(map.createLayer("Piso", tiles, 0, 0));
    renderTexture.draw(map.createLayer("Paredes", tiles, 0, 0));

    map.layers.forEach(layer => {
      layer.data.forEach(row => {
        row.forEach(tile => {
          if (tile?.properties?.zonaTP) {
            this.teleportZones.push(tile);
          }
          if (tile?.properties?.apareceTP) {
            this.appearZones.push(tile);
          }
        });
      });
    });
    //se definen fisiicas entre el player y el Layer infeior, ademas de la funcion que llama
    this.physics.add.overlap(this.faune, LayerAbajo, this.handleTeleport, null, this);
  }
  //esta funcion es llamada cuando el jugador tiene contacto con el layer inferior y se activa cuando el player toca una tile de zonaTP, eligiendo aleatoriamente una tile con apareceTP
  handleTeleport(player, tile) {
    if (tile.properties.zonaTP && this.appearZones.length > 0) {
      const randomIndex = Phaser.Math.Between(0, this.appearZones.length - 1);
      const targetZone = this.appearZones[randomIndex];
      player.setPosition(targetZone.pixelX, targetZone.pixelY);
    }
  }

  //seguimiento del enemigo
  seguimiento(){
    const player = this.faune;
    const enemy = this.lizard;
  
    const angleToPlayer = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    this.physics.velocityFromRotation(angleToPlayer, 50, enemy.body.velocity);
  }

  update(){
    //movimiento del player
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
  //recollecion de monedas
  collectCoin(player, coin) {
    coin.disableBody(true, true); 
    this.score += 10;

    this.scoreText.setText(`Puntuacion: ${this.score}`);
  }

  
}