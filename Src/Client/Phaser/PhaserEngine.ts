import {ERROR} from '../../Shared/ERROR';
import {CanvasDiv} from '../../Client/Gui/CanvasDiv';
// import {Body} from '../../Client/Gui/Body';
import {Canvas} from '../../Client/Phaser/Canvas';
import {FlightScene} from '../../Client/Phaser/FlightScene';

//const Phaser = require('phaser');

export class PhaserEngine
{
  constructor()
  {
    this.game = new Phaser.Game(this.config);
  }

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

  private game: Phaser.Game;

  public static onCanvasDivResize()
  {
    this.instance.onCanvasDivResize();
  }

  private onCanvasDivResize()
  {
    console.log('Test div resized');

    this.canvas.updateSize();
    this.game.resize(this.canvas.getWidth(), this.canvas.getHeight());
    this.flightScene.onCanvasResize();
  }
}
