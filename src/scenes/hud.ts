export class Hud extends Phaser.Scene{

    private texts: Phaser.GameObjects.BitmapText[];

    constructor() {
        super({
            key: "Hud"
        });
    }

    init(): void {
        this.texts = [];
    }

    create(): void {
        this.texts.push(
            this.add.bitmapText(
                this.scene.systems.canvas.width - 70,
                10,
                "font",
                `Lives: ${this.registry.get("lives")}`,
                8
            )
        );

        this.texts.push(
            this.add.bitmapText(
                10,
                10,
                "font",
                `Points: ${this.registry.get("points")}`,
                8
            )
        );

        this.texts.push(
            this.add.bitmapText(
                this.scene.systems.canvas.width/2 - 25,
                10,
                "font",
                `MainMenu`,
                8
            )
        );

        this.texts[2].setInteractive().on('pointerdown', () => {
            this.scene.start("Menu");
            this.scene.stop("Game");
        });

        const level = this.scene.get("Game");
        level.events.on("pointsChanged", this.updatePoints, this);
        level.events.on("livesChanged", this.updateLives, this);
    }

    private updatePoints() {
        this.texts[1].setText(`Points: ${this.registry.get("points")}`);
    }
    
    private updateLives() {
        this.texts[0].setText(`Lives: ${this.registry.get("lives")}`);
    }
}