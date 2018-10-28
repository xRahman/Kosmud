import { CanvasDiv } from "../../Client/Gui/CanvasDiv";
import { FlightScene } from "../../Client/Phaser/FlightScene";

/// Phaser is listed in html direcly for now (should be imported though).
// const Phaser = require('phaser');

export class PhaserEngine
{
  constructor(width: number, height: number)
  {
    this.flightScene = new FlightScene(width, height);

    this.phaserGame = new Phaser.Game
    (
      {
        type: Phaser.AUTO,
        width,
        height,
        disableContextMenu: true,
        parent: CanvasDiv.ELEMENT_ID,
        scene: this.flightScene
      }
    );

    this.phaserGame.tra
  }

  private flightScene: FlightScene;

  private phaserGame: Phaser.Game;

  public resize(width: number, height: number)
  {
    this.phaserGame.resize(width, height);
    this.flightScene.resize(width, height);
  }

  public getFlightScene() { return this.flightScene; }
}
