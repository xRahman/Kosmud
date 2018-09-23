"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Physics_1 = require("./Physics");
const Ship_1 = require("./Ship");
/*
  Part of BrutusNEXT

  Server-side game simulation.
*/
const PHYSICS_TICK_MILISECONDS = 1000 / 60;
const CLIENT_UPDATE_TICK_MILISECONDS = 1000 / 60;
class Game {
    constructor() {
        this.physics = new Physics_1.Physics();
        /// Test:
        this.ship = new Ship_1.Ship(this.physics.createBody(0, 0));
    }
    start() {
        // Run physics tick 60 times per second.
        setInterval(() => { this.physics.tick(PHYSICS_TICK_MILISECONDS); }, PHYSICS_TICK_MILISECONDS);
        setInterval(() => { this.updateClients(); }, CLIENT_UPDATE_TICK_MILISECONDS);
        /// Test:
        this.ship.startTurningLeft();
        this.ship.moveForward();
    }
    updateClients() {
        console.log('Ship position:'
            + ' ' + this.ship.getX() + ', ' + this.ship.getY() + ','
            + ' angle: ' + this.ship.getAngle());
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map