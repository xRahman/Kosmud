define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Camera {
        constructor(scene) {
            this.scene = scene;
            this.camera = null;
        }
        // ! Throws exception on error.
        create() {
            if (!this.scene.cameras) {
                throw new Error("Failed to create camera because 'cameras'"
                    + " don't exist in the scene");
            }
            if (!this.scene.cameras.main) {
                throw new Error("Failed to create camera because 'main'"
                    + " camera doesn't exist in the scene");
            }
            this.camera = this.scene.cameras.main;
        }
        // ! Throws exception on error.
        update() {
            if (!this.camera)
                throw new Error("Failed to update camera because it doesn't exist");
            // // Note: Setting 'x' and 'y' to the camera ignores
            // // 'scrollFactor' set on game objects. So in  order to
            // // 'use scrollFactor' we need to set 'scrollX' and 'scrollY'.
            // if (this.camera.scrollX < -500 || this.camera.scrollX > 500)
            //   this.camera.scrollX -= 1;
            // else
            //   this.camera.scrollX += 1;
        }
    }
    exports.Camera = Camera;
});
//# sourceMappingURL=Camera.js.map