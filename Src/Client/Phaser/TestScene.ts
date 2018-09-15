//const Phaser = require('phaser');

export class TestScene extends Phaser.Scene
{
  constructor()
  {
    super('TestScene');
  }

  public preload()
  {
    this.load.image('ship', '/graphics/ships/hecate.png');
    this.load.image('background', '/graphics/background/deep_space0.jpg');
  }

  public create()
  {
    this.add.tileSprite(0, 0, 1024, 768, 'background');

    this.add.sprite(400, 500, 'ship');
  }

  public update()
  {
  }
}
