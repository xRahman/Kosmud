import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Background } from "../../Client/FlightScene/Background";
import { Ship } from "../../Client/Game/Ship";
import { ShipGraphics } from "../../Client/FlightScene/ShipGraphics";
import { SceneContents } from "../../Client/Engine/SceneContents";
import { Waypoint } from "../../Client/FlightScene/Waypoint";
import { Vector } from "../../Shared/Physics/Vector";
import { ShipSound } from "../../Client/FlightScene/ShipSound";

export class FlightSceneContents extends SceneContents
{
  public background: Background;
  public waypoint: Waypoint;
  public ship: Ship | "Doesn't exist" = "Doesn't exist";

  constructor(scene: FlightScene, canvasWidth: number, canvasHeight: number)
  {
    super(scene, canvasWidth, canvasHeight);

    this.background = new Background(scene, canvasWidth, canvasHeight);

    this.waypoint = new Waypoint
    (
      scene,
      new Vector({ x: 0, y: 0 }),
      0
    );
  }

  public static preload(scene: FlightScene)
  {
    Background.preload(scene);
    ShipGraphics.preload(scene);
    ShipSound.preload(scene);
    Waypoint.preload(scene);
  }

  // ---------------- Public methods --------------------

  public addShip(ship: Ship)
  {
    /// TODO Až bude lodí víc, tak je přidávat nějak inteligentnějš.
    this.ship = ship;
  }

  /// TEST
  // // tslint:disable-next-line:prefer-function-over-method
  // public create(scene: FlightScene)
  // {
  // }

  public update()
  {
    this.waypoint.update(this.mouse);

    this.mouse.update();
    // this.camera.update();

    if (this.ship !== "Doesn't exist")
      this.ship.update();
  }
}