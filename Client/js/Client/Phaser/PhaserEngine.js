define(["require", "exports", "../../Client/Gui/CanvasDiv", "../../Client/Phaser/Canvas", "../../Client/Phaser/FlightScene"], function (require, exports, CanvasDiv_1, Canvas_1, FlightScene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// Phaser is listed in html direcly for now (should be imported though).
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
            let canvas = this.instance.canvas;
            console.log('Test div resized');
            canvas.updateSize();
            this.instance.game.resize(canvas.getWidth(), canvas.getHeight());
            this.instance.flightScene.onCanvasResize();
        }
    }
    PhaserEngine.instance = new PhaserEngine();
    exports.PhaserEngine = PhaserEngine;
});
//# sourceMappingURL=PhaserEngine.js.map