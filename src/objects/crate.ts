export class Crate extends Phaser.GameObjects.Image {
    
    body = this.body as Phaser.Physics.Arcade.Body;

    constructor(params) {
        
        super(params.scene, params.x, params.y, params.key);

        this.initImage();
        this.initPhysics();
        this.scene.add.existing(this);

    }

    private initImage(): void {
        this.setOrigin(0.5, 0.5);
    }

    private initPhysics(): void {
        this.scene.physics.world.enable(this);
    }

}