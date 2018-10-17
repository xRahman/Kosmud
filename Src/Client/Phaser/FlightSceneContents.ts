import {FlightScene} from '../../Client/Phaser/FlightScene';
import {Background} from '../../Client/Phaser/Background';
import {Ship} from '../../Client/Phaser/Ship';
import {SceneContents} from '../../Client/Phaser/SceneContents';

export class FlightSceneContents extends SceneContents
{
  constructor(scene: FlightScene, canvasWidth: number, canvasHeight: number)
  {
    super(scene, canvasWidth, canvasHeight);

    this.background = new Background(scene, canvasWidth, canvasHeight);
  }

  // ----------------- Public data ----------------------

  public background: Background;

  public ship: Ship | "Doesn't exist" = "Doesn't exist";

  // ---------------- Public methods --------------------

  public addShip(ship: Ship)
  {
    /// TODO Až bude lodí víc, tak je přidávat nějak inteligentnějš.
    this.ship = ship;
  }
}