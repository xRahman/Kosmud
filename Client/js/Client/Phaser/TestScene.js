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
            /// Size of background image 'deep_space0.jpg' is 3840x2400.
            /// Origin of game coordinates is top-left. So placing
            /// background imagte to 1920x1200 puts it to the top left
            /// corner of the screen - which is not exacly what we want
            /// (we want it to stretch over whole screen), but it's better
            /// than to see just a quarter of it.
            ///   Also we don't really need it to be tileSprite, because
            /// background doesn't move (it represents far-away space).
            this.add.tileSprite(1920, 1200, 3840, 2400, 'background');
            /// At this moment I don't have a clue what these numbers mean.
            this.add.sprite(400, 500, 'ship');
        }
        update() {
        }
    }
    exports.TestScene = TestScene;
});
//# sourceMappingURL=TestScene.js.map