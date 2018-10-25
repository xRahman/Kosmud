/*
  Part of Kosmud

  Request to set player ship destination.

  (Part of client-server communication protocol.)
*/

import { Vector } from "../../Shared/Physics/Vector";
import { Packet } from "../../Shared/Protocol/Packet";

export class SetDestination extends Packet
{
  constructor(protected destination: Vector)
  {
    super();
  }
}