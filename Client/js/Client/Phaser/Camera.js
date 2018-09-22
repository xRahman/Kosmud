define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Camera {
        constructor(scene) {
            this.scene = scene;
            this.camera = getMainCamera(scene);
        }
        update() {
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
    // ----------------- Auxiliary Functions ---------------------
    // ! Throws exception on error.
    function getMainCamera(scene) {
        if (!scene.cameras) {
            throw new Error("Failed to create camera because 'cameras'"
                + " don't exist in the scene");
        }
        if (!scene.cameras.main) {
            throw new Error("Failed to create camera because 'main'"
                + " camera doesn't exist in the scene");
        }
        return scene.cameras.main;
    }
});
//# sourceMappingURL=Camera.js.map