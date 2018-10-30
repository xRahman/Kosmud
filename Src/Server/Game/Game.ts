/*
  Part of Kosmud

  Server-side game simulation.
*/

import { Syslog } from "../../Shared/Log/Syslog";
import { Physics } from "../../Shared/Physics/Physics";
import { Ship } from "../../Server/Game/Ship";
import { Connections } from "../../Server/Net/Connections";
import { SceneUpdate } from "../../Shared/Protocol/SceneUpdate";

const GAME_TICK_MILISECONDS = 1000 / 60;

const physics = new Physics();

export namespace Game
{
  /// Test:
  export let ship = new Ship(physics.world.createBody());

  export function startLoop()
  {
    setInterval
    (
      () => { tick(GAME_TICK_MILISECONDS); },
      GAME_TICK_MILISECONDS
    );
  }

  /// TEMPORARY (finálně by se tohle mělo dělat jinak - minimálně
  //    bude víc lodí).
  export function getShipToSceneInfo()
  {
    const shipInfo =
    {
      rotation: ship.getRotation(),
      position: ship.getPosition(),
      shape: ship.getShape(),
    };

    return shipInfo;
  }
}

// ----------------- Auxiliary Functions ---------------------

function tick(tickDuration: number)
{
  try
  {
    updatePhysics(tickDuration);
    updateClients();
  }
  catch (error)
  {
    Syslog.reportUncaughtException(error);
  }
}

function updatePhysics(tickDuration: number)
{
  updateVelocity();
  physics.tick(tickDuration);
}

function updateClients()
{
  const sceneUpdate = new SceneUpdate
  (
    Game.ship.getPosition(),
    Game.ship.getRotation(),
    Game.ship.getDesiredVelocity(),
    Game.ship.getSteeringForce(),
    Game.ship.getDesiredSteeringForce()
  );

  // TODO: Sent all scene update data, not just one ship.
  Connections.broadcast(sceneUpdate);
}

function updateVelocity()
{
  // ship.updateVelocityDirection();
  Game.ship.steer();
}