"use strict";
/*
  Part of BrutusNEXT

  Matter.js physics engine wrapper.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const PhysicsBody_1 = require("../../Server/Game/PhysicsBody");
const Matter = require("matter-js");
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
//# sourceMappingURL=Physics.js.map