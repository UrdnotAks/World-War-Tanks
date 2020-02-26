import { Bullet } from "./bullet";

export class Enemy extends Phaser.GameObjects.Image {
    
    body = this.body as Phaser.Physics.Arcade.Body;

    private bullets: Phaser.GameObjects.Group;
    private enemyType: string;
    private lives: number;
    private reloadTime: number;
    private killScore: number;
    private speed: number;
    fireSound: Phaser.Sound.BaseSound;
    
    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets;
    }

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);

        this.initVariables(params);
        this.initImage();
        this.initPhysics();
        this.scene.add.existing(this);
    }

    private initVariables(params): void {
        this.fireSound = this.scene.sound.add("fire", {volume: 0.3});
        this.bullets = this.scene.add.group({
            maxSize: 10,
            runChildUpdate: true
        });
        this.enemyType = params.key;
        this.speed = 35;
        
        switch(this.enemyType) {
            
            case "tank1":
                this.lives = 1;
                this.reloadTime = 4000;
                this.killScore = 1;
                break;
            
            case "tank2":
                this.lives = 2;
                this.reloadTime = 5000;
                this.killScore = 2;
                break;

            case "tank3":
                this.lives = 3;
                this.reloadTime = 6000;
                this.killScore = 3;
                break;
        }
       
    }

    private initImage(): void {
        this.setOrigin(0.5, 0.5);
        this.setActive(true);
    }

    private initPhysics(): void {
        this.scene.physics.world.enable(this);
        this.body.setSize(this.displayWidth, this.displayHeight);
        this.body.setVelocityX(this.speed);
    }


    update(): void {
        if(this.active) {

            if(Phaser.Math.RND.between(0, this.reloadTime) === 0) {
                this.bullets.add(
                    new Bullet({
                        scene: this.scene,
                        x: this.x,
                        y: this.y,
                        key: "bullet",
                        speed: 100
                    })
                );
                this.fireSound.play();
            }

        }

        else {
            this.addPoints();
            this.destroy();
        }
    }

    public changeDirection(direction: number): void {
        this.body.setVelocityX(direction*this.speed);
    }

    public moveDown(): void {
        this.y += 1;
    }

    public gotHurt(): void {
        this.lives -= 1;

        if(this.lives === 0) {
            this.setActive(false);
        }

    }

    private addPoints(): void {
        let getCurrentPoints = this.scene.registry.get("points");
        this.scene.registry.set("points", getCurrentPoints + this.killScore);
        this.scene.events.emit("pointsChanged");
    }
}