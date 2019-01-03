/*  Part of Kosmud  */

import { FlightScene } from "../../Client/Flight/FlightScene";
import { WaypointModel } from "../../Client/Flight/WaypointModel";

export class FlightSceneGUI
{
  private readonly waypointModel: WaypointModel;

  constructor(scene: FlightScene)
  {
    this.waypointModel = new WaypointModel(scene);
  }

  // ------------- Public static methods ----------------

  public static loadAssets(scene: FlightScene)
  {
    WaypointModel.loadAssets(scene);
  }

  // ---------------- Public methods --------------------

  public moveWaypoint(position: { x: number; y: number })
  {
    return this.waypointModel.move(position);
  }
}