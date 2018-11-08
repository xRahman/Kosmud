import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Background } from "../../Client/FlightScene/Background";
import { Ship } from "../../Client/Game/Ship";
import { ShipGraphics } from "../../Client/FlightScene/ShipGraphics";
import { SceneContents } from "../../Client/Phaser/SceneContents";
import { Waypoint } from "../../Client/FlightScene/Waypoint";
import { Vector } from "../../Shared/Physics/Vector";

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
    scene.load.audio("Sound_ShipEngine1", "Sound/Ship/Engine/ShipEngine1.mp3");
    scene.load.audio("Sound_ShipEngine2", "Sound/Ship/Engine/ShipEngine2.mp3");

    Background.preload(scene);
    ShipGraphics.preload(scene);
    Waypoint.preload(scene);
  }

  // ---------------- Public methods --------------------

  public addShip(ship: Ship)
  {
    /// TODO Až bude lodí víc, tak je přidávat nějak inteligentnějš.
    this.ship = ship;
  }

  // tslint:disable-next-line:prefer-function-over-method
  public create(scene: FlightScene)
  {
    // const engineSound1 = scene.sound.add("Sound_ShipEngine1");
    // const engineSound2 = scene.sound.add("Sound_ShipEngine2");
    const engineSound = scene.sound.add("Sound_ShipEngine2");

    // engineSound1.play("", { loop: true });
    engineSound.play("", { loop: true, volume: 1 });
    if ("volume" in engineSound)
    {
      // tslint:disable-next-line:no-string-literal
      (engineSound as any)["volume"] = 0.05;
    }
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