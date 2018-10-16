
/*
  Part of Kosmud

  Notifies the client about a new visible ship.

  (Part of client-server communication protocol.)
*/


import {Renderer} from '../../Client/Phaser/Renderer';
import {Connection} from '../../Client/Net/Connection';
import {PhysicsBody} from '../../Shared/Physics/PhysicsBody';
import {Vector} from '../../Shared/Physics/Vector';
import * as Shared from '../../Shared/Protocol/ShipToScene';

export class ShipToScene extends Shared.ShipToScene
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    // let sceneContents = Renderer.getFlightSceneContents();

    // if (sceneContents)
    // {
    //   sceneContents.getShip().setPositionAndAngle
    //   (
    //     this.shipPosition,
    //     this.shipRotationRadians
    //   );
    // }
  }
}

// This class is registered in Client/Net/Connection.