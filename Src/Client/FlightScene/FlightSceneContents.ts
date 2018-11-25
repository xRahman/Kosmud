import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Background } from "../../Client/FlightScene/Background";
import { Ship } from "../../Client/Game/Ship";
import { SceneContents } from "../../Client/Engine/SceneContents";
import { Waypoint } from "../../Client/FlightScene/Waypoint";

export class FlightSceneContents extends SceneContents
{
  public background: Background;
  public waypoint: Waypoint;
  public ship: Ship | "Doesn't exist" = "Doesn't exist";

  constructor
  (
    scene: FlightScene,
    input: Phaser.Input.InputPlugin,
    canvasWidth: number,
    canvasHeight: number
  )
  {
    super(input);

    this.background = new Background(scene, canvasWidth, canvasHeight);

    this.waypoint = new Waypoint(scene);
  }

  public static preload(scene: FlightScene)
  {
    Background.preload(scene);
    Waypoint.preload(scene);
  }

  // ---------------- Public methods --------------------

  public addShip(ship: Ship)
  {
    /// TODO Až bude lodí víc, tak je přidávat nějak inteligentnějš.
    this.ship = ship;
  }

  public update()
  {
    this.waypoint.update(this.mouse);

    this.mouse.update();
    // this.camera.update();

    if (this.ship !== "Doesn't exist")
      this.ship.update();
  }
}