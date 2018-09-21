/// Phaser is listed in html direcly for now (should be imported though).
//const Phaser = require('phaser');
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FlightScene extends Phaser.Scene {
        constructor(canvas) {
            super('FlightScene');
            this.canvas = canvas;
            // ----------------- Private data ---------------------
            this.background = null;
        }
        // ---------------- Public methods --------------------
        onCanvasResize() {
            this.resizeBackground();
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
        // ---------------- Private methods -------------------
        preload() {
            this.load.image('ship', '/graphics/ships/hecate.png');
            this.load.image('background', '/graphics/background/deep_space0.jpg');
        }
        create() {
            this.createBackground();
            this.createShip();
        }
        update() {
            // Note: Setting 'x' and 'y' to the camera ignores
            // 'scrollFactor' set on game objects. So in  order to
            // 'use scrollFactor' we need to set 'scrollX' and 'scrollY'.
            if (this.cameras.main.x < -500 || this.cameras.main.x > 500)
                this.cameras.main.scrollX -= 1;
            else
                this.cameras.main.scrollX += 1;
        }
        createBackground() {
            // Display origin of the sprite is in the middle but origin
            // of canvas coords is at the top left. We want to center
            // the background in the canvas so we need to place it
            // to [canvasWidth / 2, canvasHeight / 2] coordinates.
            this.background = this.add.sprite(this.canvas.getWidth() / 2, this.canvas.getHeight() / 2, 'background');
            /// This should make the background not to move with camera but it
            /// doesn't work.
            //this.background.setScrollFactor(0, 0);
            //this.background.setDisplayOrigin(0, 0);
            this.resizeBackground();
            this.background.setScrollFactor(0);
        }
        createShip() {
            /// At this moment I don't have a clue what these numbers mean.
            let ship = this.add.sprite(400, 500, 'ship');
            ship.setScrollFactor(0.5);
        }
        // ! Throws exception on error.
        resizeBackground() {
            if (!this.background) {
                throw new Error("Attempt to resize phaser"
                    + " scene before background is loaded");
            }
            const canvasWidth = this.canvas.getWidth();
            const canvasHeight = this.canvas.getHeight();
            const imageWidth = this.background.width;
            const imageHeight = this.background.height;
            if (canvasWidth === 0) {
                throw new Error("Background cannot be resized"
                    + " because canvas has zero width");
            }
            if (canvasHeight === 0) {
                throw new Error("Background cannot be resized"
                    + " because canvas has zero height");
            }
            if (imageWidth === 0) {
                throw new Error("Background cannot be resized"
                    + " because background sprite has zero width");
            }
            if (imageHeight === 0) {
                throw new Error("Background cannot be resized"
                    + " because background sprite has zero height");
            }
            const canvasRatio = canvasWidth / canvasHeight;
            const imageRatio = imageWidth / imageHeight;
            let width = canvasWidth;
            let height = canvasHeight;
            // console.log('imageWidth: ' + imageWidth + ', imageHeight: ' + imageHeight);
            // When the canvas is resized, we need to resize background
            // to cover whole canvas again. Aspect ratio of canvas will
            // almost certainly differ from aspect ratio of background,
            // which needs to persist, so only one dimension of background
            // will be equal to the respective dimension of canvas,
            // the other will be bigger (background will overlap canvas a bit).
            //   The new 'width' or 'height' will be computed using following
            // equation: 'imageRatio = width / height'.
            if (imageRatio > canvasRatio) {
                // 'height' equals to canvasHeight, 'width' will be computed from it.
                width = height * imageRatio;
            }
            else {
                // 'width' equals to canvasWidth, 'height' will be computed from it'.
                height = width / imageRatio;
            }
            // console.log
            // (
            //   'Resizing background to: ' + width + ', ' + height
            //   + ' (ratio : ' + width / height + ')'
            // );
            this.background.setDisplaySize(width, height);
            // Position of background needs to be in the middle of
            // canvas so it depends on cavas size too and we need to
            // update it.
            this.background.setX(this.canvas.getWidth() / 2);
            this.background.setY(this.canvas.getHeight() / 2);
        }
    }
    exports.FlightScene = FlightScene;
});
// ----------------- Auxiliary Functions ---------------------
//# sourceMappingURL=FlightScene.js.map