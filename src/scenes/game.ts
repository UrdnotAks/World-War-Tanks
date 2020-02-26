import { Enemy } from "../objects/enemy";
import { Player } from "../objects/player";
import { Crate } from "../objects/crate";

export class Game extends Phaser.Scene{

    private enemies: Phaser.GameObjects.Group;
    private crates: Phaser.GameObjects.Group;
    private player: Player;
    private safeZone: number;
    explosionSound: Phaser.Sound.BaseSound;
    bgm: Phaser.Sound.BaseSound;

    public getCrates(): Phaser.GameObjects.Group {
        return this.crates;
    }

    constructor(){
        super({
            key: "Game"
        });
    }

    init(): void {
        this.enemies = this.add.group({
            runChildUpdate: true
         });

         this.crates = this.add.group({
             runChildUpdate: true
         });

         this.safeZone = this.sys.canvas.height - 110;
    }

    create(): void {

        this.explosionSound = this.sound.add("explosion", {volume: 0.3});
        this.bgm = this.sound.add("bgm", {volume: 0.2, loop: true});
        this.bgm.play();

        this.player = new Player({
            scene: this,
            x: this.sys.canvas.width / 2,
            y: this.sys.canvas.height - 20,
            key: "player"
        });

        for(let y = 0; y < 4; y++) {
            for(let x = 0; x < 8; x++) {
                let type: string;
                if(y === 0) {
                    type = "tank3";
                }
                else if(y === 1) {
                    type = "tank2";
                }
                else {
                    type = "tank1";
                }

                this.enemies.add(
                    new Enemy({
                        scene: this,
                        x: 20 + x * 25,
                        y: 60 + y * 25,
                        key: type
                    })
                );
            }
        }

        for(let i=0; i<3; i++) {
            
            switch(i) {
                case 0:
                    for(let x=1 ; x<5 ; x++) {
                        this.crates.add(
                            new Crate({
                                scene: this,
                                x: x * this.sys.canvas.width / 5,
                                y: this.sys.canvas.height - 94,
                                key: "crate"
                            })
                        );
                    }
                    break;

                case 1:
                    for(let x=1 ; x<5 ; x++) {
                        let offset=x * this.sys.canvas.width / 5;
                        offset -= 4;
                        for(let i=0; i<2; i++) {
                            this.crates.add(
                                new Crate({
                                    scene: this,
                                    x: offset,
                                    y: this.sys.canvas.height - 86,
                                    key: "crate"
                                })
                            );
                            offset += 8;
                        }
                    }
                    break;

                case 2:
                    for(let x=1 ; x<5 ; x++) {
                        let offset=x * this.sys.canvas.width / 5;
                        offset -= 8;
                        for(let i=0; i<3; i++) {
                            this.crates.add(
                                new Crate({
                                    scene: this,
                                    x: offset,
                                    y: this.sys.canvas.height - 78,
                                    key: "crate"
                                })
                            );
                            offset += 8;
                        }
                    }
                    break;
            }

        }
        
    }

    update(): void {

        if(this.player.active){
            
            this.player.update();

            this.enemies.children.each((enemy: Enemy) => {
                enemy.update();
                if(enemy.getBullets().getLength() > 0) {
                    this.physics.overlap(
                        enemy.getBullets(),
                        this.player,
                        this.bulletHitPlayer,
                        null,
                        this
                    );

                    this.physics.overlap(
                        enemy.getBullets(),
                        this.getCrates(),
                        this.enemyHitCrate,
                        null,
                        this
                    );
                }

                if(enemy.x + enemy.displayWidth > this.sys.canvas.width) {
                    this.changeDirection(-1);
                }

                if(enemy.x < 20) {
                    this.changeDirection(1);
                }

                if(enemy.y > this.safeZone) {
                    this.scene.start("Restart");
                    this.scene.stop("Hud");
                }

            }, this);

            this.checkCollisions();
        }

        if(this.registry.get("lives") < 0) {
            this.scene.start("Restart");
            this.scene.stop("Hud");
        }

        if(this.enemies.getLength() === 0) {
            this.scene.start("GameWon");
            this.scene.stop("Hud");
        }
    }

    private changeDirection(direction: number): void {
        this.enemies.children.each((enemy: Enemy) => {
            enemy.changeDirection(direction);
            enemy.moveDown();
        })
    }

    private checkCollisions(): void {
        this.physics.overlap(
            this.player.getBullets(),
            this.enemies,
            this.bulletHitEnemy,
            null,
            this
        );

        this.physics.overlap(
            this.player.getBullets(),
            this.getCrates(),
            this.playerHitCrate,
            null,
            this
        )
    }

    private enemyHitCrate(bullet, crate): void {
        bullet.destroy();
        crate.destroy();
        this.explosionSound.play();
    }
    private playerHitCrate(bullet, crate): void {
        bullet.destroy();
        crate.destroy();
        this.explosionSound.play();
    }

    private bulletHitPlayer(bullet, player): void {
        bullet.destroy();
        player.gotHurt();
        this.explosionSound.play();
    }

    private bulletHitEnemy(bullet, enemy): void {
        bullet.destroy();
        enemy.gotHurt();
        this.explosionSound.play();
    }
}