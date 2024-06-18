import Preloader from '../scenes/Preload.js';
import DungeonScene from '../scenes/DungeonScene.js';

// Create a new Phaser game instance

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#000",
  parent: "game-container",
  pixelArt: true,
  scene: DungeonScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    },
  },

  scene: [Preloader, DungeonScene],
  scale: {
    zoom: 2
  }
};

const game = new Phaser.Game(config);
