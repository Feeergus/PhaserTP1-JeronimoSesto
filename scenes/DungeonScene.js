export default class Game extends Phaser.Scene {

  constructor() {
    super("game");
    this.score = 0;
    this.shaderTime = 0;
    this.purpleLightShader = null;
  }

  preload() {
    this.load.tilemapTiledJSON("Mazmorra", "tiles/8bits.json");
    this.load.image("tiles", "tiles/tileset(pruebaFinal).png");
    this.load.atlas("faune", "character/Atlas.png", "character/Atlas.json");
    this.load.atlas("lizard", "enemy/lizard.png", "enemy/lizard.json");
    this.load.atlas("coins", "coins/spritesheet.png", "coins/spritesheet.json");
    this.load.glsl("purpleLightShader", "shaders/purpleLight.glsl");
    //cursores para el movimiento
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const map = this.make.tilemap({ key: "Mazmorra" });
    const tiles = map.addTilesetImage("tileset(pruebaFinal)", "tiles");
    
    const LayerAbajo = map.createLayer("Piso", tiles, 0, 0);
    const LayerArriba = map.createLayer("Paredes", tiles, 0, 0);
    LayerArriba.setCollisionByProperty({ colliders: true });

    const zonaTPTiles = map.filterTiles(tile => tile.properties.zonaTP);
    zonaTPTiles.forEach(tile => {
      const { x, y, width, height } = tile.getCenter();
      const purpleLight = this.add.shader("purpleLightShader", x, y, width, height);
      purpleLight.setOrigin(0.5, 0.5);

      purpleLight.setUniforms({
        time: 0,
        resolution: { x: this.game.config.width, y: this.game.config.height }
      });

      this.purpleLightShader = purpleLight;
    });

    this.lizard = this.physics.add.sprite(250, 128, "lizard", "lizard_m_idle_anim_f0.png");
    this.lizard.body.setSize(this.lizard.width * 0.9, this.lizard.height * 0.6);
    this.physics.add.collider(this.lizard, LayerArriba);

    this.faune = this.physics.add.sprite(108, 128, "faune", "sprites/run-down/run-down-6.png");
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);
    this.physics.add.collider(this.faune, LayerArriba);
    this.cameras.main.startFollow(this.faune, true);

    this.scoreText = this.add.text(16, 16, 'Puntuación: 0', { fontSize: '20px', fill: '#fff' });
    this.scoreText.setScrollFactor(0);

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

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.seguimiento,
      callbackScope: this
    });

    const coins = map.getObjectLayer("elements")?.objects;
    this.coinsGroup = this.physics.add.group();
    coins.forEach(coin => {
      const newCoin = this.coinsGroup.create(coin.x, coin.y, "coins", 0);
    });

    this.physics.add.collider(this.faune, this.coinsGroup, this.collectCoin, null, this);

    this.anims.create({
      key: "money",
      frames: this.anims.generateFrameNames("coins", { start: 0, end: 5, prefix: "pixil-frame-", suffix: ".png"}),
      repeat: -1
    });

    this.coinsGroup.children.iterate(coin => {
      coin.anims.play("money", true);
    });

    this.teleportZones = [];
    this.appearZones = [];

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

    this.physics.add.overlap(this.faune, LayerAbajo, this.handleTeleport, null, this);
  }

  handleTeleport(player, tile) {
    if (tile.properties.zonaTP && this.appearZones.length > 0) {
      const randomIndex = Phaser.Math.Between(0, this.appearZones.length - 1);
      const targetZone = this.appearZones[randomIndex];
      player.setPosition(targetZone.pixelX, targetZone.pixelY);
    }
  }

  seguimiento() {
    const player = this.faune;
    const enemy = this.lizard;
  
    const angleToPlayer = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    this.physics.velocityFromRotation(angleToPlayer, 50, enemy.body.velocity);
  }

  update() {
    const speed = 100;
    if (!this.cursors || !this.faune) {
      return;
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

    if (this.purpleLightShader) {
      this.shaderTime += this.game.loop.delta;
      this.purpleLightShader.setUniform('time', this.shaderTime);
    }
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true); 
    this.score += 10;
    this.scoreText.setText(`Puntuacion: ${this.score}`);
  }

}
