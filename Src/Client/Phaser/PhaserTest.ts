import {ERROR} from '../../Shared/ERROR';
import {CanvasDiv} from '../../Client/Gui/CanvasDiv';
import {Body} from '../../Client/Gui/Body';
import {TestScene} from '../../Client/Phaser/TestScene';

//const Phaser = require('phaser');

export class PhaserTest
{
  constructor()
  {
    this.game = new Phaser.Game(this.config);

    window.addEventListener
    (
      'resize',
      () => { this.onDivResize(); }
    );
  }

  private scene = new TestScene();

  private config: GameConfig =
  {
    type: Phaser.AUTO,
    width: Body.getCanvasDivElement().clientWidth,
    height: Body.getCanvasDivElement().clientHeight,
    parent: CanvasDiv.ELEMENT_ID,
    scene: this.scene
  };

  private game: Phaser.Game;

  private onDivResize()
  {
    console.log('Test div resized');

    let width = Body.getCanvasDivElement().clientWidth;
    let height = Body.getCanvasDivElement().clientHeight;

    console.log('Resizing game to ' + width + ', ' + height)

    this.game.resize(width, height);
    this.scene.onDivResize(width, height);
  }
}
