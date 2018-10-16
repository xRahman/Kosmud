import {Keyboard} from '../../Client/Phaser/Keyboard';
import {Scene} from '../../Client/Phaser/Scene';
import {Camera} from '../../Client/Phaser/Camera';
import {Background} from '../../Client/Phaser/Background';
import {Ship} from '../../Client/Phaser/Ship';
import {Mouse} from '../../Client/Phaser/Mouse';

export class SceneContents
{
  constructor(scene: Scene, canvasWidth: number, canvasHeight: number)
  {
    this.camera = new Camera(scene);
    this.keyboard = new Keyboard(scene.input.keyboard);
    this.mouse = new Mouse(scene.input.activePointer, scene.input.mouse);

    this.background = new Background(scene, canvasWidth, canvasHeight);
  }
  

  // public getShip() { return this.ship; }

  // ----------------- Public data ----------------------
 
 // public cursors = this.scene.input.keyboard.createCursorKeys();
  public camera: Camera; 
  public keyboard: Keyboard;
  public mouse: Mouse;

  public background: Background;

  public ship: Ship | "Doesn't exist" = "Doesn't exist";

  // ---------------- Public methods --------------------

  // // This method is run periodically by Phaser.
  // public update()
  // {
  //   this.camera.update();
  //   this.mouse.update();
  // }

  // public resize(width: number, height: number)
  // {
  //   this.background.resize(width, height);


  //   // if (!this.cameras)
  //   // {
  //   //   ERROR("Attempt to resize phaser scene before"
  //   //     + " it has been fully inicialized");
  //   //   return;
  //   // }
  //   //? (Musí se tohle volat?)
  //   /// - Nejspíš nemusí.
  //   // this.cameras.resize(width, height);
  // }

  // ---------------- Private methods -------------------

  // private onKeyupA()
  // {
  //   this.ship.turn(-1);
  // }
}

// ----------------- Auxiliary Functions ---------------------
