import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { SceneContents } from "../../Client/Engine/SceneContents";
import { Waypoint } from "../../Client/FlightScene/Waypoint";

export class FlightSceneContents extends SceneContents
{
  public waypoint: Waypoint;
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

    this.waypoint = new Waypoint(scene);
  }

  public static loadAssets(scene: FlightScene)
  {
    Waypoint.loadAssets(scene);
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
    this.waypoint.update(this.mouse);

    this.mouse.update();
    // this.camera.update();

    /// Lodě jsou teď ve scéně.
    // if (this.ship !== "Doesn't exist")
    //   this.ship.update();
  }
}