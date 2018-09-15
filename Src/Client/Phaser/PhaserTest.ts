import {TestScene} from '../../Client/Phaser/TestScene';

//const Phaser = require('phaser');

export class PhaserTest
{
  private config =
  {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    scene: new TestScene()
  };

  private game = new Phaser.Game(this.config);

  // private game = new Phaser.Game
  // (
  //   {
  //     width: 1024,
  //     height: 768,
  //     Phaser.AUTO,
  //     // Name of the <div> element which will be used to render the game.
  //     /// Prozatim to mam natvrdo v index.html.
  //     'phaser-test-div',
  //     {
  //       create: this.create,
  //       preload: this.preload
  //     }
  //   }
  // );

  // constructor(width = 1024, height = 768)
  // {
  //   super
  //   (
  //     width,
  //     height,
  //     Phaser.AUTO,
  //     // Name of the <div> element which will be used to render the game.
  //     /// Prozatim to mam natvrdo v index.html.
  //     'phaser-test-div',
  //     {
  //       create: this.create,
        
  //     }
  //   );
  // }

  // private preload()
  // {
  //   this.scene.load.image('ship', '/graphics/ships/hecate.png');
  //   this.game.load.image('background', '/graphics/background/deep_space0.jpg');
  // }

  // private create()
  // {
  //   this.game.add.tileSprite(0, 0, 1024, 768, 'background');

  //   this.game.add.sprite(400, 500, 'ship');
  // }

  // private update()
  // {
  // }
}
