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
    /// DEBUG:
    console.log("ZoneUpdate.process()", this.vehicles);

    /// 'ships' už by měly bejt updatnutý, protože jsou poslaný
    ///   jako entity.
    /// Ještě je ale potřeba zavolat něco jako onZoneUpdate(), aby se
    ///   přepočítaly modely (např. exhausty)

    /// Ehm - vlastně asi nemusím složitě provolávat přes zónu k lodím,
    /// když mám přímo seznam updatnutých lodí, což?

    // ! Throws exception on error.
    for (const vehicle of this.vehicles)
    {
      // ! Throws exception on error.
      vehicle.update();
    }

    /// To be deleted.
    // const flightScene = Scenes.getFlightScene();
    // if (flightScene.isActive())
    //    flightScene.onZoneUpdate();
    //
    /// TODO: Přepsat.
    // if (Scenes.getFlightScene().isActive())
    //   connection.getZone().updateShips(this.shipStates);
  }
}

// This class is registered in Client/Net/Connection.