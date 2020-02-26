import { Bullet } from "./bullet";

export class Player extends Phaser.GameObjects.Image {

    body = this.body as Phaser.Physics.Arcade.Body;
    
    private bullets: Phaser.GameObjects.Group;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private moveSpeed: number;
    private nextShoot: number;
    private shootingKey: Phaser.Input.Keyboard.Key;
    fireSound: Phaser.Sound.BaseSound;

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets;
    }

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);

        this.initVariables();
        this.initImage();
        this.initInput();
        this.initPhysics();

        this.scene.add.existing(this);
    }

    private initVariables(): void {
        this.fireSound = this.scene.sound.add("fire", {volume: 0.3});
        this.bullets = this.scene.add.group({
            runChildUpdate: true
        });
        this.nextShoot = 0;
        this.moveSpeed = 100;
    }

    private initImage(): void {
        this.setOrigin(0.5, 0.5);
    }

    private initInput(): void {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.shootingKey = this.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    private initPhysics(): void {
        this.scene.physics.world.enable(this);
        this.body.setSize(this.displayWidth, this.displayHeight);
    }

    update(): void{
        this.handleMovement();
        this.handleShooting();
    }

    private handleMovement(): void {
        if(
            this.cursors.right.isDown && 
            this.x < this.scene.sys.canvas.width - this.width) {
                this.body.setVelocityX(this.moveSpeed);
        }

        else if(this.cursors.left.isDown && this.x > this.width) {
            this.body.setVelocityX(-this.moveSpeed);
        }

        else {
            this.body.setVelocityX(0);
        }
    
    }

    private handleShooting(): void {
        if (this.shootingKey.isDown && this.scene.time.now > this.nextShoot) {
            if(this.bullets.getLength() < 1) {
                this.bullets.add(
                    new Bullet({
                        scene: this.scene,
                        x: this.x,
                        y: this.y - this.height,
                        key: "bulletPlayer",
                        speed: -300
                    })
                );
                this.fireSound.play();
            }

            this.nextShoot = this.scene.time.now + 500;
        }
    }

    public gotHurt() {
        let currentLives = this.scene.registry.get("lives");
        this.scene.registry.set("lives", currentLives - 1);
        this.scene.events.emit("livesChanged");

        this.x = this.scene.sys.canvas.width / 2;
        this. y = this.scene.sys.canvas.height - 20;
    }
}