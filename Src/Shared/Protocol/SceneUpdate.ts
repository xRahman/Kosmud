/*
  Part of Kosmud

  Description of change of scene contents.

  (Part of client-server communication protocol.)
*/

import { Packet } from "../../Shared/Protocol/Packet";
import { Vector } from "../../Shared/Physics/Vector";

export class SceneUpdate extends Packet
{
  constructor
  (
    public shipPosition: Vector,
    public shipRotationRadians: number,
    public desiredVelocity: Vector,
    public steeringForce: Vector
  )
  {
    super();
  }
}
