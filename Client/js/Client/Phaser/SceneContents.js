define(["require", "exports", "../../Client/Phaser/Camera", "../../Client/Phaser/Background", "../../Client/Phaser/Ship"], function (require, exports, Camera_1, Background_1, Ship_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SceneContents {
        constructor(canvas, scene) {
            this.canvas = canvas;
            this.scene = scene;
            // ----------------- Private data ---------------------
            this.camera = new Camera_1.Camera(this.scene);
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            this.background = new Background_1.Background(this.scene, this.canvas);
            this.ship = new Ship_1.Ship(this.scene);
        }
        // ---------------- Public methods --------------------
        // This method is run periodically be Phaser.
        update() {
            this.camera.update();
            this.ship.update(this.cursors);
        }
        onCanvasResize() {
            this.background.resize();
            // if (!this.cameras)
            // {
            //   ERROR("Attempt to resize phaser scene before"
            //     + " it has been fully inicialized");
            //   return;
            // }
            //? (Musí se tohle volat?)
            /// - Nejspíš nemusí.
            // this.cameras.resize(width, height);
        }
    }
    exports.SceneContents = SceneContents;
});
// ----------------- Auxiliary Functions ---------------------
//# sourceMappingURL=SceneContents.js.map