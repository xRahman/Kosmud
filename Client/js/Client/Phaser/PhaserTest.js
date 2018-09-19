define(["require", "exports", "../../Shared/ERROR", "../../Client/Phaser/TestScene"], function (require, exports, ERROR_1, TestScene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //const Phaser = require('phaser');
    class PhaserTest {
        constructor() {
            this.scene = new TestScene_1.TestScene();
            this.config = {
                type: Phaser.AUTO,
                width: 400,
                height: 300,
                parent: 'phaser-test-div',
                scene: this.scene
            };
            this.game = new Phaser.Game(this.config);
            // /// Test
            // let phaserTestDiv = document.getElementById('phaser-test-div');
            // if (!phaserTestDiv)
            // {
            //   ERROR("Failed to find 'phaserTestDiv' element");
            //   return;
            // }
            // phaserTestDiv.addEventListener
            // (
            //   'resize',
            //   () => { this.onPhaserTestDivResize(); }
            // );
            window.addEventListener('resize', () => { this.onPhaserTestDivResize(); });
        }
        onPhaserTestDivResize() {
            console.log('Test div resized');
            let phaserTestDiv = document.getElementById('phaser-test-div');
            if (!phaserTestDiv) {
                ERROR_1.ERROR("Failed to find 'phaserTestDiv' element");
                return;
            }
            let width = phaserTestDiv.clientWidth;
            let height = phaserTestDiv.clientHeight;
            console.log('Resizing game to ' + width + ', ' + height);
            this.game.resize(width, height);
            this.scene.cameras.resize(width, height);
            if (this.scene.background) {
                this.scene.background.setDisplaySize(width, height);
            }
            else {
                ERROR_1.ERROR('Invalid background reference');
            }
        }
    }
    exports.PhaserTest = PhaserTest;
});
//# sourceMappingURL=PhaserTest.js.map