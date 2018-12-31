/*
  Part of Kosmud

  Request to set player ship waypoint.

  (Part of client-server communication protocol.)
*/

import { Vector } from "../../Shared/Physics/Vector";
import { Packet } from "../../Shared/Protocol/Packet";

export class SetWaypoint extends Packet
{
  public waypoint: { x: number; y: number } | "Not set" = "Not set";
}