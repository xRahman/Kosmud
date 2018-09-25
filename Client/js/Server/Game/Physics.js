/*
  Part of BrutusNEXT

  Matter.js physics engine wrapper.
*/
define(["require", "exports", "../../Server/Game/PhysicsBody", "matter-js"], function (require, exports, PhysicsBody_1, Matter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Physics {
        constructor() {
            this.engine = Matter.Engine.create();
            this.disableGravity();
        }
        tick(miliseconds) {
            Matter.Engine.update(this.engine, miliseconds);
        }
        createBody(x, y) {
            /// Prozatím natvrdo čtverec.
            return new PhysicsBody_1.PhysicsBody(this.createSquareBody(x, y, 100));
        }
        /// Only squares atm.
        createSquareBody(x, y, size) {
            let squareBody = Matter.Bodies.rectangle(x, y, size, size);
            // Add 'squareBody' to physics world.
            Matter.World.add(this.engine.world, [squareBody]);
            return squareBody;
        }
        disableGravity() {
            this.engine.world.gravity.y = 0;
        }
    }
    exports.Physics = Physics;
});
//# sourceMappingURL=Physics.js.map