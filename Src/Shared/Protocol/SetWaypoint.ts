/*
  Part of Kosmud

  Request to set player ship waypoint.

  (Part of client-server communication protocol.)
*/

import { Packet } from "../../Shared/Protocol/Packet";

export class SetWaypoint extends Packet
{
  public waypoint: { x: number; y: number } | "Not set" = "Not set";

  protected getWaypoint()
  {
    if (this.waypoint === "Not set")
    {
      throw new Error(`Waypoint has not been set`);
    }

    return this.waypoint;
  }
}