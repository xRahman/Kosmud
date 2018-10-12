
import {Background} from '../../Client/Phaser/Background';
import {Ship} from '../../Client/Phaser/Ship';
import {SceneContents} from '../../Client/Phaser/SceneContents';

export class Scene extends Phaser.Scene
{
  constructor(sceneName: string)
  {
    super(sceneName);
  }

  public getSceneContents() { return this.contents; }

  // ----------------- Private data ---------------------

  private contents: SceneContents | null = null;

  // ---------------- Public methods --------------------

  // This method is run by Phaser.
  public preload()
  {
    Background.preload(this);
    Ship.preload(this);
  }

  // ! Throws exception on error.
  // This method is run by Phaser.
  public create(canvasWidth: number, canvasHeight: number)
  {
    if (this.contents)
      throw new Error('Scene contents already exists');

    this.contents = new SceneContents(this, canvasWidth, canvasHeight);
  }

  // This method is run periodically by Phaser.
  public update()
  {
    if (!this.contents)
      throw new Error("Scene contents doesn't exist");

    this.contents.update();
  }

  public resize(width: number, height: number)
  {
    if (!this.contents)
      throw new Error("Scene contents doesn't exist");

    this.contents.resize(width, height);
  }

  // ---------------- Private methods -------------------

}

// ----------------- Auxiliary Functions ---------------------
