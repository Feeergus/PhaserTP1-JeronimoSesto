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
  }

  
}