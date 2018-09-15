//const Phaser = require('phaser');
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TestScene extends Phaser.Scene {
        constructor() {
            super('TestScene');
        }
        preload() {
            this.load.image('ship', '/graphics/ships/hecate.png');
            this.load.image('background', '/graphics/background/deep_space0.jpg');
        }
        create() {
            this.add.tileSprite(0, 0, 1024, 768, 'background');
            this.add.sprite(400, 500, 'ship');
        }
        update() {
        }
    }
    exports.TestScene = TestScene;
});
//# sourceMappingURL=TestScene.js.map