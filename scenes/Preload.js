export default class Preloader extends Phaser.Scene{

    constructor()
    {
        super("preloader");
    }

    preload()
    {
        //this.load.image('tiles', 'tiles/Dungeon_tiles.png');
        //this.load.tilemapTiledJSON('dungeon', 'tiles/Mazmorra2.json');
    }
   
    create()
    {
        this.scene.start('game');
    }
}