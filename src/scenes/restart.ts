export class Restart extends Phaser.Scene
{
    private startKey: Phaser.Input.Keyboard.Key;
    private texts: Phaser.GameObjects.BitmapText[] = [];

    constructor(){
        
        super({
            key: "Restart"
        });

    }

    init(): void {
        
        this.startKey = this.input.keyboard.addKey(
                            Phaser.Input.Keyboard.KeyCodes.SPACE
                        );
        this.startKey.isDown = false;

    }

    create(): void {
        
        this.texts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 30,
                this.sys.canvas.height / 2 - 20,
                "font",
                "GAME OVER",
                8
            )
        );

        this.texts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 80,
                this.sys.canvas.height / 2 + 20,
                "font",
                "PRESS SPACE TO RESTART",
                8
            )
        )

    }

    update(): void {

        if(this.startKey.isDown){
            this.initRegistry();
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
