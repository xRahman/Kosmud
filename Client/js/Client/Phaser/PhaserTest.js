define(["require", "exports", "../../Client/Gui/CanvasDiv", "../../Client/Gui/Body", "../../Client/Phaser/TestScene"], function (require, exports, CanvasDiv_1, Body_1, TestScene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //const Phaser = require('phaser');
    class PhaserTest {
        constructor() {
            this.scene = new TestScene_1.TestScene();
            this.config = {
                type: Phaser.AUTO,
                width: Body_1.Body.getCanvasDivElement().clientWidth,
                height: Body_1.Body.getCanvasDivElement().clientHeight,
                parent: CanvasDiv_1.CanvasDiv.ELEMENT_ID,
                scene: this.scene
            };
            this.game = new Phaser.Game(this.config);
            window.addEventListener('resize', () => { this.onDivResize(); });
        }
        onDivResize() {
            console.log('Test div resized');
            let width = Body_1.Body.getCanvasDivElement().clientWidth;
            let height = Body_1.Body.getCanvasDivElement().clientHeight;
            console.log('Resizing game to ' + width + ', ' + height);
            this.game.resize(width, height);
            this.scene.onDivResize(width, height);
        }
    }
    exports.PhaserTest = PhaserTest;
});
//# sourceMappingURL=PhaserTest.js.map