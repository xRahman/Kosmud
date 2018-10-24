import { FlightScene } from "../../Client/Phaser/FlightScene";
import { Background } from "../../Client/Phaser/Background";
import { Ship } from "../../Client/Phaser/Ship";
import { SceneContents } from "../../Client/Phaser/SceneContents";
import { DestinationMarker } from "./DestinationMarker";
import { Vector } from "../../Shared/Physics/Vector";

export class FlightSceneContents extends SceneContents
{
  constructor(scene: FlightScene, canvasWidth: number, canvasHeight: number)
  {
    super(scene, canvasWidth, canvasHeight);

    this.background = new Background(scene, canvasWidth, canvasHeight);

    this.destinationMarker = new DestinationMarker
    (
      scene,
      new Vector({ x: 0, y: 0 })
    );
  }

  // ----------------- Public data ----------------------

  public background: Background;
  public destinationMarker: DestinationMarker;
  public ship: Ship | "Doesn't exist" = "Doesn't exist";

  public static preload(scene: FlightScene)
  {
    Background.preload(scene);
    Ship.preload(scene);
    DestinationMarker.preload(scene);
  }

  // ---------------- Public methods --------------------

  public addShip(ship: Ship)
  {
    /// TODO Až bude lodí víc, tak je přidávat nějak inteligentnějš.
    this.ship = ship;
  }
}