import Preloader from '../scenes/Preload.js';
import Game from '../scenes/Game.js';

// Create a new Phaser game instance
export default new Phaser.Game({  type: Phaser.AUTO,
  width: 1000,
  height: 650,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Preloader, Game],
  scale: {
    zoom: 2
  }
});
