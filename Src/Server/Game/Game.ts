/*
  Part of Kosmud

  Server-side game simulation.
*/

import {Syslog} from '../../Shared/Log/Syslog';
import {Physics} from '../../Server/Physics/Physics';
import {Ship} from '../../Server/Game/Ship';
import {Connections} from '../../Server/Net/Connections';
import {SceneUpdate} from '../../Shared/Protocol/SceneUpdate';

const PHYSICS_TICK_MILISECONDS = 1000 / 60;
const CLIENT_UPDATE_TICK_MILISECONDS = 1000 / 60;

export class Game
{
  private static physics = new Physics();

  /// Test:
  public static ship = new Ship(Game.physics.createBody(0, 0));

  public static startLoop()
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
    try
    {
      this.updateVelocity();
      this.physics.tick(PHYSICS_TICK_MILISECONDS);
    }
    catch (error)
    {
      // Note:
      //   This callback function is the entry point of our packet-handling
      //   code so it's also the last place where we can catch any exception
      //   and report it.
      Syslog.reportUncaughtException(error);
    }
  }

  private static updateClients()
  {
    try
    {
      let shipPosition = this.ship.getPosition();
      let sceneUpdate = new SceneUpdate(shipPosition);

      /// TODO: Sent all scene update data, not just one ship.
      Connections.broadcast(sceneUpdate);
    }
    catch (error)
    {
      // Note:
      //   This callback function is the entry point of our packet-handling
      //   code so it's also the last place where we can catch any exception
      //   and report it.
      Syslog.reportUncaughtException(error);
    }
  }

  private static updateVelocity()
  {
    this.ship.updateVelocityDirection();
  }
}