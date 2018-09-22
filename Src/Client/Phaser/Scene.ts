
import {Canvas} from '../../Client/Phaser/Canvas';
import {Background} from '../../Client/Phaser/Background';
import {Ship} from '../../Client/Phaser/Ship';
import {SceneContents} from '../../Client/Phaser/SceneContents';

export class Scene extends Phaser.Scene
{
  constructor(private canvas: Canvas, sceneName: string)
  {
    super(sceneName);
  }

  // ----------------- Private data ---------------------

  private contents: SceneContents | null = null;

  // ---------------- Public methods --------------------

  // This method is run by Phaser.
  public preload()
  {
    console.log('preload');

    Background.preload(this);
    Ship.preload(this);
  }

  // ! Throws exception on error.
  // This method is run by Phaser.
  public create()
  {
    if (this.contents)
      throw new Error('Scene contents already exists');

    this.contents = new SceneContents(this.canvas, this);
  }

  // This method is run periodically by Phaser.
  public update()
  {
    if (!this.contents)
      throw new Error("Scene contents doesn't exist");

    this.contents.update();
  }

  public onCanvasResize()
  {
    if (!this.contents)
      throw new Error("Scene contents doesn't exist");

    this.contents.onCanvasResize();
  }

  // ---------------- Private methods -------------------

}

// ----------------- Auxiliary Functions ---------------------
