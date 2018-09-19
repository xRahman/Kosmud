import {ERROR} from '../../Shared/ERROR';
import {TestScene} from '../../Client/Phaser/TestScene';

//const Phaser = require('phaser');

export class PhaserTest
{
  constructor()
  {
    // /// Test
    // let phaserTestDiv = document.getElementById('phaser-test-div');
    // if (!phaserTestDiv)
    // {
    //   ERROR("Failed to find 'phaserTestDiv' element");
    //   return;
    // }
    // phaserTestDiv.addEventListener
    // (
    //   'resize',
    //   () => { this.onPhaserTestDivResize(); }
    // );
    window.addEventListener
    (
      'resize',
      () => { this.onPhaserTestDivResize(); }
    );
  }

  private scene = new TestScene();

  private config: GameConfig =
  {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    parent: 'phaser-test-div',
    scene: this.scene
  };

  private game = new Phaser.Game(this.config);

  private onPhaserTestDivResize()
  {
    console.log('Test div resized');


    let phaserTestDiv = document.getElementById('phaser-test-div');

    if (!phaserTestDiv)
    {
      ERROR("Failed to find 'phaserTestDiv' element");
      return;
    }

    let width = phaserTestDiv.clientWidth;
    let height = phaserTestDiv.clientHeight;

    console.log('Resizing game to ' + width + ', ' + height)

    this.game.resize(width, height);

    this.scene.cameras.resize(width, height);

    if (this.scene.background)
    {
      this.scene.background.setDisplaySize(width, height);
    }
    else
    {
      ERROR('Invalid background reference');
    }
  }

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
