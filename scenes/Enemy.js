

export default class Enemy extends Phaser.Scene{

    constructor() {
        
        super("enemy");
    }

    preload(){
        
    }

    create(){
        

        this.anims.create({
            key: "lizard-idle",
            frames: this.anims.generateFrameNames("lizard", { start: 0, end: 3, prefix: "lizard_m_idle_anim_f", suffix: ".png"}),
            repeat: -1,
            framerate: 10
        });
      
        this.anims.create({
            key: "lizard-run",
            frames: this.anims.generateFrameNames("lizard", { start: 0, end: 3, prefix: "lizard_m_run_anim_f", suffix: ".png"}),
            repeat: -1,
            framerate: 10
        });
      
        this.anims.create({
            key: "lizard-hit",
            frames: [{ key: "lizard", frame: "lizard_m_hit_anim_f0.png"}]
        });

    }


    
}
