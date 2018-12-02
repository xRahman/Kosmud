import { Scene } from "../../Client/Engine/Scene";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { WaypointModel } from "../../Client/Flight/WaypointModel";

export class FlightSceneGUI
{
  private readonly waypointModel: WaypointModel;

  constructor(scene: Scene)
  {
    this.waypointModel = new WaypointModel(scene);
  }

  public static loadAssets(scene: FlightScene)
  {
    WaypointModel.loadAssets(scene);
  }

  public moveWaypoint(position: { x: number; y: number })
  {
    return this.waypointModel.move(position);
  }
}