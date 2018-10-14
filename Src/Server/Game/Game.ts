/*
  Part of Kosmud

  Server-side game simulation.
*/

import {Syslog} from '../../Shared/Log/Syslog';
//import {Physics} from '../../Server/Physics/Physics';
import {Physics} from '../../Shared/Physics/Physics';
import {Ship} from '../../Server/Game/Ship';
import {Connections} from '../../Server/Net/Connections';
import {SceneUpdate} from '../../Shared/Protocol/SceneUpdate';

const GAME_TICK_MILISECONDS = 1000 / 60;

export class Game
{
  private static physics = new Physics();

  /// Test:
  public static ship = new Ship(Game.physics.world.createBody());

  public static startLoop()
  {
    setInterval
    (
      () => { this.tick(GAME_TICK_MILISECONDS); },
      GAME_TICK_MILISECONDS
    );
  }

  private static tick(tickDuration: number)
  {
    try
    {
      this.updatePhysics(tickDuration);
      this.updateClients();
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error);
    }
  }

  private static updatePhysics(tickDuration: number)
  {
    this.updateVelocity();
    this.physics.tick(tickDuration);
  }

  private static updateClients()
  {
    let shipPosition = this.ship.getPosition();
    let sceneUpdate = new SceneUpdate(shipPosition);

    // TODO: Sent all scene update data, not just one ship.
    Connections.broadcast(sceneUpdate);
  }

  private static updateVelocity()
  {
    this.ship.updateVelocityDirection();
  }
}