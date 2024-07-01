import DungeonScene from './scenes/DungeonScene.js';

// Create a new Phaser game instance

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 260,
  backgroundColor: "00000",
  parent: "game-container",
  pixelArt: true,
  scene: DungeonScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
        debug: true
    },
  },

  scene: [DungeonScene],
  scale: {
    zoom: 2.25
  }
};

const game = new Phaser.Game(config);
