define(["require", "exports", "../../Client/Phaser/Camera", "../../Client/Phaser/Background", "../../Client/Phaser/Ship"], function (require, exports, Camera_1, Background_1, Ship_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FlightScene extends Phaser.Scene {
        constructor(canvas) {
            super('FlightScene');
            this.canvas = canvas;
            // ----------------- Private data ---------------------
            // private camera: Camera;
            this.camera = new Camera_1.Camera(this);
            this.background = new Background_1.Background(this, this.canvas);
            this.ship = new Ship_1.Ship(this);
            // this.scene = new Phaser.Scene('FlightScene');
            // this.camera = new Camera(this.scene);
        }
        // ---------------- Public methods --------------------
        // This method is run be Phaser.
        preload() {
            console.log('preload');
            this.background.preload();
            this.ship.preload();
        }
        // This method is run be Phaser.
        create() {
            console.log('create');
            this.camera.create();
            this.background.create();
            this.ship.create();
        }
        // This method is run periodically be Phaser.
        update() {
            this.camera.update();
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
    exports.FlightScene = FlightScene;
});
// ----------------- Auxiliary Functions ---------------------
//# sourceMappingURL=FlightScene.js.map