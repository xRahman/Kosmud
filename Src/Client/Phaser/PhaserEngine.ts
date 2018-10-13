import {CanvasDiv} from '../../Client/Gui/CanvasDiv';
import {Scene} from '../../Client/Phaser/Scene';

/// Phaser is listed in html direcly for now (should be imported though).
//const Phaser = require('phaser');

export class PhaserEngine
{
  constructor(width: number, height: number)
  {
    this.flightScene = new Scene('FlightScene', width, height)
    this.phaserGame = new Phaser.Game
    (
      {
        type: Phaser.AUTO,
        width,
        height,
        parent: CanvasDiv.ELEMENT_ID,
        scene: this.flightScene
      }
    );
  }

  private flightScene: Scene;

  private phaserGame: Phaser.Game;

  public resize(width: number, height: number)
  {
    this.phaserGame.resize(width, height);
    this.flightScene.resize(width, height);
  }

  public getFlightScene() { return this.flightScene; }
}
