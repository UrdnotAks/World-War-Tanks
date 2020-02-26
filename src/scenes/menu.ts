export class Menu extends Phaser.Scene
{
    private startKey: Phaser.Input.Keyboard.Key;
    private texts: Phaser.GameObjects.BitmapText[] = [];

    constructor(){
        
        super({
            key: "Menu"
        });

    }

    init(): void {
        
        this.startKey = this.input.keyboard.addKey(
                            Phaser.Input.Keyboard.KeyCodes.SPACE
                        );
        this.startKey.isDown = false;
        this.initRegistry();

    }

    preload(): void{
        this.load.pack(
            "preload",
            "./assets/pack.json",
            "preload"
        );
        
        this.load.audio("explosion", "./assets/sounds/Explosion.wav");
        this.load.audio("fire", "./assets/sounds/TankFiring.wav");

        this.load.audio("bgm", "./assets/sounds/bgm.mp3");
    }

    create(): void {
        
        this.texts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 70,
                this.sys.canvas.height / 2,
                "font",
                "PRESS SPACE TO PLAY",
                8
            )
        );

        this.texts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 60,
                this.sys.canvas.height / 2 - 40,
                "font",
                "WORLD WAR TANKS",
                8
            )
        );
    }

    update(): void {

        if(this.startKey.isDown){
            this.scene.start("Hud");
            this.scene.start("Game");
            this.scene.bringToTop("Hud");
        }

    }

    private initRegistry(): void {

        this.registry.set("points", 0);
        this.registry.set("lives", 3);
        this.registry.set("level", 1);

    }
}
