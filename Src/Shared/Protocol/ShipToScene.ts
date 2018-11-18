/*
  Part of Kosmud

  Notifies the client about a new visible ship.

  (Part of client-server communication protocol.)
*/

import { Vector } from "../../Shared/Physics/Vector";
import { Physics } from "../../Shared/Physics/Physics";
import { Packet } from "../../Shared/Protocol/Packet";

export class ShipToScene extends Packet
{
  constructor
  (
    public shipShape: Physics.Shape,
    public shipPosition: Vector,
    public shipRotation: number
  )
  {
    super();
  }
}
