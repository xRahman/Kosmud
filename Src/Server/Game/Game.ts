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

  /// TEMPORARY (finálně by se tohle mělo dělat jinak - minimálně
  //    bude víc lodí).
  public static getShipToSceneInfo()
  {
    const shipInfo =
    {
      geometry: this.ship.getGeometry(),
      position: this.ship.getPosition(),
      angleRadians: this.ship.getAngle(),
    };

    return shipInfo;
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
    let shipAngle = this.ship.getAngle();
    let sceneUpdate = new SceneUpdate(shipPosition, shipAngle);

    // TODO: Sent all scene update data, not just one ship.
    Connections.broadcast(sceneUpdate);
  }

  private static updateVelocity()
  {
    //this.ship.updateVelocityDirection();
    this.ship.steer();
  }
}