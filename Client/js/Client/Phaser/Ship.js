define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const SHIP_SPRITE_ID = 'ship';
    class Ship {
        constructor(scene) {
            this.scene = scene;
            this.sprite = null;
            this.sprite = createShipSprite(this.scene);
        }
        static preload(scene) {
            scene.load.image(SHIP_SPRITE_ID, '/graphics/ships/hecate.png');
        }
    }
    exports.Ship = Ship;
    // ----------------- Auxiliary Functions ---------------------
    function createShipSprite(scene) {
        let shipSprite = scene.add.sprite(400, 500, SHIP_SPRITE_ID);
        // shipSprite.setScrollFactor(0.5);
        return shipSprite;
    }
});
//# sourceMappingURL=Ship.js.map