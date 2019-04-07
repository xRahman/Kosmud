/*  Part of Kosmud  */

// import { Scenes } from "../../Client/Engine/Scenes";
import { Ship } from "../../Client/Game/Ship";
import { Connection } from "../../Client/Net/Connection";
import * as Shared from "../../Shared/Protocol/ZoneUpdate";

export class ZoneUpdate extends Shared.ZoneUpdate
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    // Vehicles are updated automatically - they are sent as
    // entities and deserialized along with the packet.
    //   We still need to update graphics based on the new
    // data though.

    // ! Throws exception on error.
    for (const vehicle of this.vehicles)
    {
      // ! Throws exception on error.
      vehicle.update();
    }
  }
}

// This class is registered in Client/Net/Connection.