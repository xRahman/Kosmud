define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Ship {
        constructor(scene) {
            this.scene = scene;
            this.sprite = null;
        }
        // ---------------- Public methods --------------------
        preload() {
            this.scene.load.image('ship', '/graphics/ships/hecate.png');
        }
        // ! Throws exception on error.
        create() {
            if (this.sprite)
                throw new Error("Ship sprite already exists");
            this.sprite = createShipSprite(this.scene);
        }
    }
    exports.Ship = Ship;
    // ----------------- Auxiliary Functions ---------------------
    function createShipSprite(scene) {
        let shipSprite = scene.add.sprite(400, 500, 'ship');
        // shipSprite.setScrollFactor(0.5);
        return shipSprite;
    }
});
//# sourceMappingURL=Ship.js.map