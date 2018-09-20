//const Phaser = require('phaser');

import {ERROR} from '../../Shared/ERROR';

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
    /// Size of background image 'deep_space0.jpg' is 3840x2400.
    /// Origin of game coordinates is top-left. So placing
    /// background imagte to 1920x1200 puts it to the top left
    /// corner of the screen - which is not exacly what we want
    /// (we want it to stretch over whole screen), but it's better
    /// than to see just a quarter of it.
    ///   Also we don't really need it to be tileSprite, because
    /// background doesn't move (it represents far-away space).
    this.background = this.add.sprite(0, 0, 'background');
    this.background.setDisplayOrigin(0, 0);

    /// At this moment I don't have a clue what these numbers mean.
    this.add.sprite(400, 500, 'ship');
  }

  public update()
  {
  }

  public onDivResize(width: number, height: number)
  {
    this.cameras.resize(width, height);

    if (this.background)
    {
      this.background.setDisplaySize(width, height);
    }
    else
    {
      ERROR('Invalid background reference');
    }
  }
}
