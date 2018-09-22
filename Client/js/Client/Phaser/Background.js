define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Background {
        constructor(scene, canvas) {
            this.scene = scene;
            this.canvas = canvas;
            this.sprite = null;
        }
        // ---------------- Public methods --------------------
        preload() {
            this.scene.load.image('background', '/graphics/background/deep_space0.jpg');
        }
        // ! Throws exception on error.
        create() {
            if (this.sprite)
                throw new Error("Background sprite already exists");
            this.sprite = createBackgroundSprite(this.scene, this.canvas);
            console.log('Creating background sprite: ');
            console.log(this.sprite);
            // Update size and position to cover whole canvas.
            this.resize();
        }
        // ! Throws exception on error.
        resize() {
            if (!this.sprite) {
                throw new Error("Unable to resize background because"
                    + " background sprite doesn't exist");
            }
            const canvasWidth = this.canvas.getWidth();
            const canvasHeight = this.canvas.getHeight();
            const imageWidth = this.sprite.width;
            const imageHeight = this.sprite.height;
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
            // console.log
            // (
            //   'imageWidth: ' + imageWidth + ', '
            //   + '  imageHeight: ' + imageHeight
            // );
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
            this.sprite.setDisplaySize(width, height);
            // Position of background needs to be in the middle of
            // canvas so it depends on cavas size too and we need to
            // update it.
            this.sprite.setX(this.canvas.getWidth() / 2);
            this.sprite.setY(this.canvas.getHeight() / 2);
        }
    }
    exports.Background = Background;
    // ----------------- Auxiliary Functions ---------------------
    function createBackgroundSprite(scene, canvas) {
        // Display origin of the sprite is in the middle but origin
        // of canvas coords is at the top left. We want to center
        // the background in the canvas so we need to place it
        // to [canvasWidth / 2, canvasHeight / 2] coordinates.
        let backgroundSprite = scene.add.sprite(canvas.getWidth() / 2, canvas.getHeight() / 2, 'background');
        // 'scrollFactor' 0 means that the background won't move
        // along with camera (note that camera must be moved using
        // '.scrollX' and '.scrollY' rather than '.x' and '.y' for
        // scrollFactor to work.
        backgroundSprite.setScrollFactor(0);
        return backgroundSprite;
    }
});
//# sourceMappingURL=Background.js.map