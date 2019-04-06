/*  Part of Kosmud  */

import { Packet } from "../../Shared/Protocol/Packet";

export class SetWaypoint extends Packet
{
  public waypoint: { x: number; y: number } | undefined = undefined;

  // ! Throws exception on error.
  protected getWaypoint()
  {
    if (!this.waypoint)
      throw Error(`Waypoint has not been set`);

    return this.waypoint;
  }
}