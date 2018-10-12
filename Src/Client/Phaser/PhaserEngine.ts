import {CanvasDiv} from '../../Client/Gui/CanvasDiv';
import {Scene} from '../../Client/Phaser/Scene';

/// Phaser is listed in html direcly for now (should be imported though).
//const Phaser = require('phaser');

export class PhaserEngine
{
  constructor(canvasWidth: number, canvasHeight: number)
  {
    this.phaserGame = new Phaser.Game
    (
      {
        type: Phaser.AUTO,
        width: canvasWidth,
        height: canvasHeight,
        parent: CanvasDiv.ELEMENT_ID,
        scene: this.flightScene
      }
    );
  }

  private flightScene = new Scene('FlightScene');

  private phaserGame: Phaser.Game;

  // public static getFlightScene()
  // {
  //   return PhaserEngine.instance.flightScene;
  // }

  public resize(width: number, height: number)
  {
    this.phaserGame.resize(width, height);
    this.flightScene.resize(width, height);
  }

  public getFlightScene() { return this.flightScene; }
}
