import {Physics} from '../../Server/Physics/Physics';
import {Ship} from '../../Server/Game/Ship';
import {Connections} from '../../Server/Net/Connections';
import {SceneUpdate} from '../../Shared/Protocol/SceneUpdate';

/*
  Part of BrutusNEXT

  Server-side game simulation.
*/

const PHYSICS_TICK_MILISECONDS = 1000 / 60;
const CLIENT_UPDATE_TICK_MILISECONDS = 1000 / 60;

export class Game
{
  private static physics = new Physics();

  /// Test:
  public static ship = new Ship(Game.physics.createBody(0, 0));

  public static start()
  {
    // Run physics tick 60 times per second.
    setInterval
    (
      () => { this.updatePhysics(); },
      PHYSICS_TICK_MILISECONDS
    );

    setInterval
    (
      () => { this.updateClients(); },
      CLIENT_UPDATE_TICK_MILISECONDS
    );
  }

  private static updatePhysics()
  {
    this.updateVelocity();
    this.physics.tick(PHYSICS_TICK_MILISECONDS);
  }

  private static updateClients()
  {
    let shipPosition = this.ship.getPosition();
    let sceneUpdate = new SceneUpdate(shipPosition);

    /// TODO: Sent all scene update data, not just one ship.
    Connections.broadcast(sceneUpdate);
  }

  private static updateVelocity()
  {
    this.ship.updateVelocityDirection();
  }
}