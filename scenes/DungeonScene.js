// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
export default class DungeonScene extends Phaser.Scene {
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
    // Generate a random world with a few extra options:
    //  - Rooms should only have odd dimensions so that they have a center tile.
    //  - Doors should be at least 2 tiles away from corners, to leave enough room for the tiles
    //    that we're going to put on either side of the door opening.
    this.dungeon = new Dungeon({
      width: 50,
      height: 50,
      doorPadding: 2,
      rooms: {
        width: { min: 7, max: 15, onlyOdd: true },
        height: { min: 7, max: 15, onlyOdd: true }
      }
    });

    // Creating a blank tilemap with dimensions matching the dungeon
    const map = this.make.tilemap({
      tileWidth: 48,
      tileHeight: 48,
      width: this.dungeon.width,
      height: this.dungeon.height
    })
    this.MazeConst({TILE_W: this.dungeon.widht, TILE_H: this.dungeon.height});
    
    this.tileset = map.addTilesetImage("tiles" + this.sets, null, MazeConst.TILE_W, MazeConst.TILE_H, 48, 1, 2);
    //this.tilesetPaving = map.addTilesetImage("paving", null, MazeConst.TILE_W, MazeConst.TILE_H, 0, 0, this.DELTA_TILESET);
   
    this.groundLayer = map.createBlankLayer("Piso", tileset); // Wall & floor
    this.stuffLayer = map.createBlankLayer("Paredes", tileset); // Chest, stairs, etc.

    // Set all tiles in the ground layer with blank tiles (purple-black tile)
    this.groundLayer.fill(20);

    // Use the array of rooms generated to place tiles in the map
    // Note: using an arrow function here so that "this" still refers to our scene
    this.dungeon.rooms.forEach(room => {
      // These room properties are all in grid units (not pixels units)
      const { x, y, width, height, left, right, top, bottom } = room;

      // Fill the room (minus the walls) with mostly clean floor tiles (90% of the time), but
      // occasionally place a dirty tile (10% of the time).
      this.groundLayer.weightedRandomize([
        { index: 6, weight: 9 },              // 9/10 times, use index 6
        { index: [7, 8, 26], weight: 1 }      // 1/10 times, randomly pick 7, 8 or 26
      ], x + 1, y + 1, width - 2, height - 2);

      // Place the room corners tiles
      this.groundLayer.putTileAt(3, left, top);
      this.groundLayer.putTileAt(4, right, top);
      this.groundLayer.putTileAt(23, right, bottom);
      this.groundLayer.putTileAt(22, left, bottom);

      // Place the non-corner wall tiles using fill with x, y, width, height parameters
      this.groundLayer.fill(39, left + 1, top, width - 2, 1); // Top
      this.groundLayer.fill(1, left + 1, bottom, width - 2, 1); // Bottom
      this.groundLayer.fill(21, left, top + 1, 1, height - 2); // Left
      this.groundLayer.fill(19, right, top + 1, 1, height - 2); // Right
    });
  }
  

  
}