
import {Keyboard} from '../../Client/Phaser/Keyboard';
import {Scene} from '../../Client/Phaser/Scene';
import {Canvas} from '../../Client/Phaser/Canvas';
import {Camera} from '../../Client/Phaser/Camera';
import {Background} from '../../Client/Phaser/Background';
import {Ship} from '../../Client/Phaser/Ship';

export class SceneContents
{
  constructor(private canvas: Canvas, private scene: Scene)
  {
  }

  public getShip() { return this.ship; }

  // ----------------- Private data ---------------------
 
  private camera = new Camera(this.scene);
  // private cursors = this.scene.input.keyboard.createCursorKeys();
  private keyboard = new Keyboard(this.scene.input.keyboard);

  private background = new Background(this.scene, this.canvas);
  private ship = new Ship(this.scene);

  // ---------------- Public methods --------------------

  // This method is run periodically by Phaser.
  public update()
  {
    this.camera.update();

    // this.ship.update(this.cursors);
  }

  public onCanvasResize()
  {
    this.background.resize();


    // if (!this.cameras)
    // {
    //   ERROR("Attempt to resize phaser scene before"
    //     + " it has been fully inicialized");
    //   return;
    // }
    //? (Musí se tohle volat?)
    /// - Nejspíš nemusí.
    // this.cameras.resize(width, height);
  }

  // ---------------- Private methods -------------------

  // private onKeyupA()
  // {
  //   this.ship.turn(-1);
  // }
}

// ----------------- Auxiliary Functions ---------------------
