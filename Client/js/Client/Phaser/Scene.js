define(["require", "exports", "../../Client/Phaser/Background", "../../Client/Phaser/Ship", "../../Client/Phaser/SceneContents"], function (require, exports, Background_1, Ship_1, SceneContents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Scene extends Phaser.Scene {
        constructor(canvas, sceneName) {
            super(sceneName);
            this.canvas = canvas;
            // ----------------- Private data ---------------------
            this.contents = null;
        }
        // ---------------- Public methods --------------------
        // This method is run by Phaser.
        preload() {
            Background_1.Background.preload(this);
            Ship_1.Ship.preload(this);
        }
        // ! Throws exception on error.
        // This method is run by Phaser.
        create() {
            if (this.contents)
                throw new Error('Scene contents already exists');
            this.contents = new SceneContents_1.SceneContents(this.canvas, this);
        }
        // This method is run periodically by Phaser.
        update() {
            if (!this.contents)
                throw new Error("Scene contents doesn't exist");
            this.contents.update();
        }
        onCanvasResize() {
            if (!this.contents)
                throw new Error("Scene contents doesn't exist");
            this.contents.onCanvasResize();
        }
    }
    exports.Scene = Scene;
});
// ----------------- Auxiliary Functions ---------------------
//# sourceMappingURL=Scene.js.map