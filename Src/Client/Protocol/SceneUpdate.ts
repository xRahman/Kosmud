
/*
  Part of Kosmud

  Description of change of scene contents.

  (Part of client-server communication protocol.)
*/


import {Renderer} from '../../Client/Phaser/Renderer';
import {Connection} from '../../Client/Net/Connection';
import {Vector} from '../../Shared/Physics/Vector';
import * as Shared from '../../Shared/Protocol/SceneUpdate';

export class SceneUpdate extends Shared.SceneUpdate
{
  constructor(shipPosition: Vector, shipRotationRadians: number)
  {
    super(shipPosition, shipRotationRadians);

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    let sceneContents = Renderer.getFlightSceneContents();

    if (sceneContents)
    {
      sceneContents.getShip().setPositionAndAngle
      (
        this.shipPosition,
        this.shipRotationRadians
      );
    }
  }
}

// This class is registered in Client/Net/Connection.