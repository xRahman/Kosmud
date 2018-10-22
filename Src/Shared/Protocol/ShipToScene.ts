/*
  Part of Kosmud

  Notifies the client about a new visible ship.

  (Part of client-server communication protocol.)
*/

import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Packet } from "../../Shared/Protocol/Packet";

export class ShipToScene extends Packet
{
  constructor
  (
    public shipGeometry: PhysicsBody.Geometry,
    public shipPosition: Vector,
    public shipAngleRadians: number
  )
  {
    super();
  }
}
