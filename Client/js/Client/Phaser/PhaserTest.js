define(["require", "exports", "../../Shared/Error/ERROR", "../../Client/Phaser/TestScene"], function (require, exports, ERROR_1, TestScene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //const Phaser = require('phaser');
    class PhaserTest {
        constructor() {
            this.config = {
                type: Phaser.AUTO,
                width: 1024,
                height: 768,
                scene: new TestScene_1.TestScene()
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
            console.log('Resizing game to ' + phaserTestDiv.clientWidth + ', ' + phaserTestDiv.clientHeight);
            this.game.resize(phaserTestDiv.clientWidth, phaserTestDiv.clientHeight);
        }
    }
    exports.PhaserTest = PhaserTest;
});
//# sourceMappingURL=PhaserTest.js.map