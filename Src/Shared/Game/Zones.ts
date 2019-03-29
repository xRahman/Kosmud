/*  Part of Kosmud  */
/*
import { Zone } from "../../Shared/Game/Zone";
import { Serializable } from "../../Shared/Class/Serializable";

export class Zones extends Serializable
{
  protected zones = new Set<Zone>();

  protected add(zone: Zone)
  {
    if (this.zones.has(zone))
    {
      throw Error(`Attempt to add zone ${zone.debugId}`
        + ` which already exists in Zones`);
    }

    this.zones.add(zone);
  }
}
*/