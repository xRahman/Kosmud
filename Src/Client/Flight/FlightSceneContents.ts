import { FlightScene } from "../../Client/Flight/FlightScene";
import { SceneContents } from "../../Client/Engine/SceneContents";
import { WaypointModel } from "../../Client/Flight/WaypointModel";

export class FlightSceneContents extends SceneContents
{
  public waypointModel: WaypointModel;
  /// Lodě jsou teď ve scéně.
  // public ship: Ship | "Doesn't exist" = "Doesn't exist";

  constructor
  (
    scene: FlightScene,
    input: Phaser.Input.InputPlugin,
    canvasWidth: number,
    canvasHeight: number
  )
  {
    super(input);

    this.waypointModel = new WaypointModel(scene);
  }

  public static loadAssets(scene: FlightScene)
  {
    WaypointModel.loadAssets(scene);
  }

  // ---------------- Public methods --------------------

  /// Lodě jsou teď ve scéně.
  // public addShip(ship: Ship)
  // {
  //   /// TODO Až bude lodí víc, tak je přidávat nějak inteligentnějš.
  //   this.ship = ship;
  // }

  public update()
  {
    this.waypointModel.update(this.mouse);

    this.mouse.update();
    // this.camera.update();

    /// Lodě jsou teď ve scéně.
    // if (this.ship !== "Doesn't exist")
    //   this.ship.update();
  }
}