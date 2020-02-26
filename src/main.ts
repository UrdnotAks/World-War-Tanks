import "phaser";
import { Game } from "./scenes/game";
import { Hud } from "./scenes/hud";
import { Menu } from "./scenes/menu";
import { Restart } from './scenes/restart'
import { GameWon } from "./scenes/gamewon";

const config: Phaser.Types.Core.GameConfig = {
    title: "World War Tanks",
    version: "1.0",
    width: 320,
    height: 400,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    fps: {
        target: 60
    },
    type: Phaser.AUTO,
    scene: [Menu, Game, Hud, Restart, GameWon],
    input: {
        keyboard: true
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    backgroundColor: "#695206",
    //backgroundColor: "#001100",
};

export class Init extends Phaser.Game {
    
    constructor(config: Phaser.Types.Core.GameConfig){
        super(config);
    }
   
}

window.addEventListener("load", () => {
    var game = new Init(config);
});