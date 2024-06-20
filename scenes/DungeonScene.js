// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }

  preload() {
    this.load.tilemapTiledJSON("Mazmorra", "tiles/Mazmorra2.json");
    this.load.image("tiles", "tiles/Dungeon_tiles.png");

    this.load.atlas("faune", "character/Atlas.png", "character/Atlas.json");
  }
  
  create() {
    const map = this.make.tilemap({ key: "Mazmorra" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tiles = map.addTilesetImage("Dungeon_tiles", "tiles");
    //const tilesetPlatform = map.addTilesetImage("platform_atlas", "tilesPlatform");

    const LayerAbajo = map.createLayer("Piso", tiles, 0, 0);
    const LayerArriba = map.createLayer("Paredes", tiles, 0, 0);


    LayerArriba.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    LayerArriba.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    const faune = this.add.sprite(128, 128, "faune", "sprites/run-down/run-down-6.png");

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
    
    faune.anims.play("faune-idle-down");
  }

  
}