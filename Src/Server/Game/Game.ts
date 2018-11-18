/*
  Part of Kosmud

  Server-side game simulation.
*/

import { Syslog } from "../../Shared/Log/Syslog";
import { Physics } from "../../Shared/Physics/Physics";
import { Ship } from "../../Server/Game/Ship";
import { Connection } from "../../Server/Net/Connection";
import { Connections } from "../../Server/Net/Connections";
import { SceneUpdate } from "../../Shared/Protocol/SceneUpdate";
import { ShipToScene } from "../../Shared/Protocol/ShipToScene";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";

const GAME_TICK_MILISECONDS = 1000 / 60;

export namespace Game
{
  export let ships: Array<Ship> = [];

  // ! Throws exception on error.
  export function getPlayerShip()
  {
    /// Zatím navrdo první loď v seznamu.
    if (ships.length < 1)
    {
      throw new Error("Player ship doesn't exist yet");
    }

    return ships[0];
  }

  // ! Throws exception on error.
  export async function preload()
  {
    // ! Throws exception on error.
    await Ship.preload();
  }

  // ! Throws exception on error.
  export async function create()
  {
    // ! Throws exception on error.
    const shape = Ship.getShape();

    const physicsConfig: PhysicsBody.Config =
    {
      shape,
      /// Tohle je sice divně malý číslo, ale když ho zvětším, tak pak musej
      /// bejt mnohem větší všechny thrusty, torques a tak a vektory
      /// jsou pak přes celou obrazovku.
      density: 0.00001
    };

    ships.push(new Ship(physicsConfig));
  }

  export function loop()
  {
    setInterval
    (
      () => { tick(GAME_TICK_MILISECONDS); },
      GAME_TICK_MILISECONDS
    );
  }

  export function sendShipsToClient(connection: Connection)
  {
    for (const ship of ships)
    {
      connection.send(createShipToScenePacket(ship));
    }
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
  steer();
  Physics.tick(tickDuration);
}

function getShipState(ship: Ship): SceneUpdate.ShipState
{
  const shipState =
  {
    shipPosition: ship.getPosition(),
    shipRotation: ship.getRotation(),
    shipVelocity: ship.getVelocity(),
    desiredVelocity: ship.getDesiredVelocity(),
    steeringForce: ship.getSteeringForce(),
    desiredSteeringForce: ship.getDesiredSteeringForce(),
    desiredForwardSteeringForce: ship.getDesiredForwardSteeringForce(),
    desiredLeftwardSteeringForce: ship.getDesiredLeftwardSteeringForce(),
    forwardThrustRatio: ship.getForwardThrustRatio(),
    leftwardThrustRatio: ship.getLeftwardThrustRatio(),
    torqueRatio: ship.getTorqueRatio()
  };

  return shipState;
}

function getShipsState(): Array<SceneUpdate.ShipState>
{
  const result: Array<SceneUpdate.ShipState> = [];

  for (const ship of Game.ships)
  {
    result.push(getShipState(ship));
  }

  return result;
}

function updateClients()
{
  const sceneUpdate = new SceneUpdate(getShipsState());

  Connections.broadcast(sceneUpdate);
}

function steer()
{
  for (const ship of Game.ships)
  {
    ship.steer();
  }
}

function createShipToScenePacket(ship: Ship)
{
  return new ShipToScene
  (
    ship.getShape(),
    ship.getPosition(),
    ship.getRotation()
  );
}