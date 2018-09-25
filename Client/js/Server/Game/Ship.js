/*
  Part of BrutusNEXT

  TEST - a ship.
*/
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Ship {
        constructor(physicsBody) {
            this.physicsBody = physicsBody;
        }
        getX() {
            return this.physicsBody.getX();
        }
        getY() {
            return this.physicsBody.getY();
        }
        getAngle() {
            return this.physicsBody.getAngle();
        }
        startTurningLeft() {
            this.physicsBody.setAngularVelocity(-Math.PI / 12);
        }
        startTurningRight() {
            this.physicsBody.setAngularVelocity(Math.PI / 12);
        }
        stopTurning() {
            this.physicsBody.setAngularVelocity(0);
        }
        moveForward() {
            this.physicsBody.setVelocity(10);
        }
        moveBackward() {
            this.physicsBody.setVelocity(-10);
        }
        stopMoving() {
            this.physicsBody.setVelocity(0);
        }
    }
    exports.Ship = Ship;
});
//# sourceMappingURL=Ship.js.map