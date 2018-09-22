
import {Canvas} from '../../Client/Phaser/Canvas';
import {Camera} from '../../Client/Phaser/Camera';
import {Background} from '../../Client/Phaser/Background';
import {Ship} from '../../Client/Phaser/Ship';

export class FlightScene extends Phaser.Scene
{
  constructor(private canvas: Canvas)
  {
    super('FlightScene');
    // this.scene = new Phaser.Scene('FlightScene');
    // this.camera = new Camera(this.scene);
  }

  // ----------------- Private data ---------------------
 
  // private camera: Camera;
  private camera = new Camera(this);

  private background = new Background(this, this.canvas);
  private ship = new Ship(this);

  // ---------------- Public methods --------------------

  // This method is run be Phaser.
  public preload()
  {
    console.log('preload');

    this.background.preload();
    this.ship.preload();
  }

  // This method is run be Phaser.
  public create()
  {
    console.log('create');

    this.camera.create();
    this.background.create();
    this.ship.create();
  }

  // This method is run periodically be Phaser.
  public update()
  {
    this.camera.update();
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
}

// ----------------- Auxiliary Functions ---------------------
