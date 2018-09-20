//const Phaser = require('phaser');

import {ERROR} from '../../Shared/ERROR';
import {Body} from '../../Client/Gui/Body';

export class TestScene extends Phaser.Scene
{
  constructor()
  {
    super('TestScene');
  }

  public background: Phaser.GameObjects.Sprite | null = null;

  public preload()
  {
    this.load.image('ship', '/graphics/ships/hecate.png');
    this.load.image('background','/graphics/background/deep_space0.jpg');
  }

  public create()
  {
    // Display origin is by default in the middle of the sprite.
    // By placing it to top left, we can set the sprite to the
    // top left of the window (which is [0, 0] in  phaser) without
    // knowing the size of the background image.
    this.background = this.add.sprite
    (
      Body.getCanvasDivElement().clientWidth / 2,
      Body.getCanvasDivElement().clientHeight / 2,
      'background'
    );
    /// This should make the background not to move with camera but it
    /// doesn't work.
    //this.background.setScrollFactor(0, 0);
    //this.background.setDisplayOrigin(0, 0);

    /// At this moment I don't have a clue what these numbers mean.
    this.add.sprite(400, 500, 'ship');

    // Resize background image to cover canvas <div> element.
    this.onDivResize
    (
      Body.getCanvasDivElement().clientWidth,
      Body.getCanvasDivElement().clientHeight
    );
  }

  public update()
  {
    /// A way to scroll the camera:
    this.cameras.main.x += 1;
  }

  public onDivResize(canvasWidth: number, canvasHeight: number)
  {
    if (!this.cameras)
    {
      ERROR("Attempt to resize phaser scene before"
        + " it has been fully inicialized");
      return;
    }

    if (!this.background)
    {
      ERROR("Attempt to resize phaser scene before"
        + " background is loaded");
      return;
    }

    let width = canvasWidth;
    let height = canvasHeight;
    let imageWidth = this.background.width;
    let imageHeight = this.background.height;
    let canvasRatio = canvasWidth / canvasHeight;
    let imageRatio = imageWidth / imageHeight;

    console.log('imageWidth: ' + imageWidth + ', imageHeight: ' + imageHeight);

    if (imageRatio > canvasRatio)
    {
      console.log('imageRatio > canvasRatio (' + canvasRatio + '),'
      + ' height zůstává (' + height + ')');
      
      // Height zůstává.
      width = canvasHeight * imageRatio;
      /// TODO: Centrování na výšku.
    }
    else
    {
      console.log('imageRatio <= canvasRatio (' + canvasRatio + '),'
      + ' width zůstává (' + width + ')');

      // Width zůstává.
      height = canvasWidth / imageRatio;
      /// TODO: Centrování na šířku.
    }

    console.log
    (
      'Resizing background to: ' + width + ', ' + height
      + ' (ratio : ' + width / height + ')'
    );

    this.cameras.resize(width, height);
    this.background.setDisplaySize(width, height);
    this.background.setX(Body.getCanvasDivElement().clientWidth / 2);
    this.background.setY(Body.getCanvasDivElement().clientHeight / 2);
  }
}
