/*
  Part of Kosmud

  Server-side game simulation.
*/

import { Zone } from "../../Server/Game/Zone";
import { Connections } from "../../Server/Net/Connections";

/// TEST
import { Ship } from "../../Server/Game/Ship";

export namespace Game
{
  const zones: Array<Zone> = [];

  /// TEST
  export function addShip(ship: Ship)
  {
    zones[0].addShip(ship);
  }

  /// TEST
  function fakeLoad()
  {
    const zone = new Zone();

    zone.createPhysicsWorld();

    zones.push(zone);
  }

  export function tick()
  {
    update(zones);
  }

  export function updateClients()
  {
    for (const zone of zones)
    {
      const zoneUpdate = zone.getUpdate();

      /// TODO: Neposílat všem playerům updaty všech zón, stačí
      /// každému poslat update zóny, ve které se nachází.
      Connections.broadcast(zoneUpdate);
    }
  }

  // ! Throws exception on error.
  export async function load()
  {
    /// TEST
    fakeLoad();

    // ! Throws exception on error.
    await loadZones(zones);
  }

  // export function sendShipsToClient(connection: Connection)
  // {
  //   /// TODO: Tohle taky není dobře - měly by se posílat
  //   /// jen lodě ze zóny, kde zrovna player je (a možná to
  //   /// bude celé jinak).
  //   for (const zone of zones)
  //   {
  //     zone.sendShipsToClient(connection);
  //   }
  // }
}

// ----------------- Auxiliary Functions ---------------------

async function loadZones(zones: Array<Zone>)
{
  for (const zone of zones)
  {
    await zone.load();
  }
}

// function getShipsState(): Array<ZoneUpdate.ShipState>
// {
//   const result: Array<ZoneUpdate.ShipState> = [];

//   for (const ship of Game.ships)
//   {
//     result.push(getShipState(ship));
//   }

//   return result;
// }

function update(zones: Array<Zone>)
{
  for (const zone of zones)
  {
    zone.steerVehicles();
  }
}