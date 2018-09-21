define(["require", "exports", "../../Client/Gui/CanvasDiv", "../../Client/Phaser/Canvas", "../../Client/Phaser/FlightScene"], function (require, exports, CanvasDiv_1, Canvas_1, FlightScene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //const Phaser = require('phaser');
    class PhaserEngine {
        constructor() {
            this.canvas = new Canvas_1.Canvas();
            this.flightScene = new FlightScene_1.FlightScene(this.canvas);
            this.config = {
                type: Phaser.AUTO,
                width: this.canvas.getWidth(),
                height: this.canvas.getHeight(),
                parent: CanvasDiv_1.CanvasDiv.ELEMENT_ID,
                scene: this.flightScene
            };
            this.game = new Phaser.Game(this.config);
        }
        static onCanvasDivResize() {
            this.instance.onCanvasDivResize();
        }
        onCanvasDivResize() {
            console.log('Test div resized');
            this.canvas.updateSize();
            this.game.resize(this.canvas.getWidth(), this.canvas.getHeight());
            this.flightScene.onCanvasResize();
        }
    }
    PhaserEngine.instance = new PhaserEngine();
    exports.PhaserEngine = PhaserEngine;
});
//# sourceMappingURL=PhaserEngine.js.map