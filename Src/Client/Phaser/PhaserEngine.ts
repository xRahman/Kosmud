import {CanvasDiv} from '../../Client/Gui/CanvasDiv';
import {Canvas} from '../../Client/Phaser/Canvas';
import {FlightScene} from '../../Client/Phaser/FlightScene';

/// Phaser is listed in html direcly for now (should be imported though).
//const Phaser = require('phaser');

export class PhaserEngine
{
  private static instance = new PhaserEngine();

  private canvas = new Canvas();
  private flightScene = new FlightScene(this.canvas);

  private config: GameConfig =
  {
    type: Phaser.AUTO,
    width: this.canvas.getWidth(),
    height: this.canvas.getHeight(),
    parent: CanvasDiv.ELEMENT_ID,
    scene: this.flightScene
  };

  private game = new Phaser.Game(this.config);

  public static onCanvasDivResize()
  {
    let canvas = this.instance.canvas;

    console.log('Test div resized');

    canvas.updateSize();
    this.instance.game.resize(canvas.getWidth(), canvas.getHeight());
    this.instance.flightScene.onCanvasResize();
  }
}
