import {Keyboard} from '../../Client/Phaser/Keyboard';
import {Scene} from '../../Client/Phaser/Scene';
import {Camera} from '../../Client/Phaser/Camera';
import {Background} from '../../Client/Phaser/Background';
import {Ship} from '../../Client/Phaser/Ship';
import {Mouse} from '../../Client/Phaser/Mouse';

export class SceneContents
{
  constructor(private scene: Scene, canvasWidth: number, canvasHeight: number)
  {
    this.background = new Background(this.scene, canvasWidth, canvasHeight);
    this.ship = new Ship(this.scene);

    
  }

  public getShip() { return this.ship; }

  // ----------------- Private data ---------------------
 
  private camera = new Camera(this.scene);
  // private cursors = this.scene.input.keyboard.createCursorKeys();
  private keyboard = new Keyboard(this.scene.input.keyboard);
  private mouse = new Mouse
  (
    this.scene.input.activePointer,
    this.scene.input.mouse
  );

  private background: Background;
  private ship: Ship;

  // ---------------- Public methods --------------------

  // This method is run periodically by Phaser.
  public update()
  {
    this.camera.update();
    this.mouse.update();
  }

  public resize(width: number, height: number)
  {
    this.background.resize(width, height);


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
