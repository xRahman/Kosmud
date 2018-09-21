//const Phaser = require('phaser');
define(["require", "exports", "../../Client/Gui/Body"], function (require, exports, Body_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Canvas {
        constructor() {
            this.width = Body_1.Body.getCanvasDivElement().clientWidth;
            this.height = Body_1.Body.getCanvasDivElement().clientHeight;
        }
        getWidth() { return this.width; }
        getHeight() { return this.height; }
        updateSize() {
            this.width = Body_1.Body.getCanvasDivElement().clientWidth;
            this.height = Body_1.Body.getCanvasDivElement().clientHeight;
            console.log('Resizing game to ' + this.width + ', ' + this.height);
        }
    }
    exports.Canvas = Canvas;
});
//# sourceMappingURL=Canvas.js.map