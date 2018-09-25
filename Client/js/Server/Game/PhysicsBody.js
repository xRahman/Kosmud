/*
  Part of BrutusNEXT

  Matter.js physics engine wrapper.
*/
define(["require", "exports", "matter-js"], function (require, exports, Matter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PhysicsBody {
        constructor(body) {
            this.body = body;
        }
        getX() {
            return this.body.position.x;
        }
        getY() {
            return this.body.position.y;
        }
        getAngle() {
            return this.body.angle;
        }
        setVelocity(velocity) {
            this.body.angularVelocity = velocity;
        }
        setAngularVelocity(velocityRadians) {
            Matter.Body.setAngularVelocity(this.body, velocityRadians);
        }
        /// TEST.
        applyForce() {
            let force = { x: 0.01, y: 0.01 };
            this.body.force = force;
        }
    }
    exports.PhysicsBody = PhysicsBody;
});
//# sourceMappingURL=PhysicsBody.js.map