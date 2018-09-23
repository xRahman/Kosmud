import {Physics} from "./Physics";
import {Ship} from "./Ship";

/*
  Part of BrutusNEXT

  Server-side game simulation.
*/

const PHYSICS_TICK_MILISECONDS = 1000 / 60;
const CLIENT_UPDATE_TICK_MILISECONDS = 1000 / 60;

export class Game
{
  private physics = new Physics();

  /// Test:
  private ship = new Ship(this.physics.createBody(0, 0));

  public start()
  {
    // Run physics tick 60 times per second.
    setInterval
    (
      () => { this.physics.tick(PHYSICS_TICK_MILISECONDS); },
      PHYSICS_TICK_MILISECONDS
    );

    setInterval
    (
      () => { this.updateClients(); },
      CLIENT_UPDATE_TICK_MILISECONDS
    );

    /// Test:
    this.ship.startTurningLeft();
    this.ship.moveForward();
  }

  private updateClients()
  {
    console.log('Ship position:'
      + ' ' + this.ship.getX() + ', ' + this.ship.getY() + ','
      + ' angle: ' + this.ship.getAngle());
  }
}