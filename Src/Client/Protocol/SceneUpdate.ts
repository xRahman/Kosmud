
/*
  Part of Kosmud

  Description of change of scene contents.

  (Part of client-server communication protocol.)
*/

import { Renderer } from "../../Client/Phaser/Renderer";
import { Connection } from "../../Client/Net/Connection";
import * as Shared from "../../Shared/Protocol/SceneUpdate";

export class SceneUpdate extends Shared.SceneUpdate
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    const ship = Renderer.getFlightScene().getShip();

    if (ship !== "Doesn't exist")
    {
      ship.setPositionAndAngle
      (
        this.shipPosition,
        this.shipAngle
      );

      ship.vectors.setDesiredVelocity(this.desiredVelocity);
      ship.vectors.setSteeringForce(this.steeringForce);
      ship.vectors.setDesiredSteeringForce(this.desiredSteeringForce);
    }
  }
}

// This class is registered in Client/Net/Connection.