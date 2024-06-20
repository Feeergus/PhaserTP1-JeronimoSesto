export default class Preloader extends Phaser.Scene{

    constructor()
    {
        super("preloader");
    }

    preload()
    {
        //this.load.tilemapTiledJSON("Mazmorra", "tiles/Mazmorra2.json");
        //this.load.image("tiles", "tiles/Dungeon_tiles.png");
    }
   
    create()
    {
        this.scene.start('game');
    }
}