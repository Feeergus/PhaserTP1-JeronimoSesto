// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
import Dungeon from "./node_modules/@mikewesthad/dungeon";
export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }
  
  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
    const dungeon = new Dungeon({
      // The dungeon's grid size
      width: 40,
      height: 40,
      rooms: {
        // Random range for the width of a room (grid units)
        width: {
          min: 5,
          max: 10
        },
        // Random range for the height of a room (grid units)
        height: {
          min: 8,
          max: 20
        },
        // Cap the area of a room - e.g. this will prevent large rooms like 10 x 20
        maxArea: 150,
        // Max rooms to place
        maxRooms: 10
      }
    });

    const html = dungeon.drawToHtml({
      empty: " ",
      wall: "📦",
      floor: "☁️",
      door: "🚪"
    });
    
    // Append the element to an existing element on the page
    document.body.appendChild(html);
  }

  preload() {

  }

  create() {
    // const map = this.make.tilemap({ key : 'dungeon' });
    // const tileset = map.addTilesetImage('dungeon', 'tiles');

    // map.createLayer('piso', tileset);
    // const wallslayer = map.createLayer('Paredes', tileset);

    // wallslayer.setCollisionByProperty({ collides: true })

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // wallslayer.renderDebug(debugGraphics, {
    // tileColor: null, // Color of non-colliding tiles
    // collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    // faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });
    

    
  }

  update() {
    // update game objects
    
  }

  
}
