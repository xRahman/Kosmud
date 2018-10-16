import {ShipToScene} from '../../Client/Protocol/ShipToScene';
import {Background} from '../../Client/Phaser/Background';
import {Ship} from '../../Client/Phaser/Ship';
import {SceneContents} from '../../Client/Phaser/SceneContents';

const DEPTH_DEFAULT = 0;
const DEPTH_DEBUG  = DEPTH_DEFAULT + 1;

export class Scene extends Phaser.Scene
{
  constructor
  (
    private name: string,
    private width: number,
    private height: number
  )
  {
    super(name);
  }

  // ----------------- Private data ---------------------

  private addShipRequestQueue = new Array<ShipToScene>();

  private contents: SceneContents | "Doesn't exist" = "Doesn't exist";

  // --------------- Public accessors -------------------

  public getShip(): Ship | "Doesn't exist" 
  {
    if (this.contents === "Doesn't exist")
      return "Doesn't exist";

    return this.contents.ship;
  }

  // ---------------- Public methods --------------------

  public addShip(request: ShipToScene)
  {
    if (this.contents === "Doesn't exist")
    {
      this.queueAddShipRequest(request);
    }
    else
    {
      this.contents.addShip(this.createShip(request));
    }
  }

  // This method is run by Phaser.
  public preload()
  {
    /// Preloady jsou static - na preloadnuté assety se později
    /// odkazuje idčkem, nedrží se přímé reference.
    Background.preload(this);
    Ship.preload(this);
  }

  // ! Throws exception on error.
  // This method is run by Phaser.
  public create()
  {
    if (this.contents !== "Doesn't exist")
    {
      throw new Error("Failed to create scene '" + this.name + "'"
        + " because scene contents already exist");
    }

    this.contents = new SceneContents(this, this.width, this.height);

    this.createBufferedShips(this.contents);
  }

  // This method is run periodically by Phaser.
  public update()
  {
    if (this.contents === "Doesn't exist")
    {
      throw new Error("Failed to update scene '" + this.name + "'"
        + " because scene contents doesn't exist");
    }

    this.contents.camera.update();
    this.contents.mouse.update();
  }

  public resize(width: number, height: number)
  {
    if (this.contents === "Doesn't exist")
    {
      throw new Error("Failed to resize scene '" + this.name + "'"
        + " because scene contents doesn't exist");
    }

    this.width = width;
    this.height = height;

    this.contents.background.resize(width, height);

    //? (Musí se tohle volat?)
    /// - Nejspíš nemusí.
    // this.cameras.resize(width, height);
  }

  // ---------------- Private methods -------------------

  private createShip(request: ShipToScene): Ship
  {
    return new Ship
    (
      this,
      request.shipGeometry,
      request.shipPosition,
      request.shipAngleRadians
    );
  }

  private queueAddShipRequest(request: ShipToScene)
  {
    /// DEBUG:
    console.log("Queueing ship add request");

    this.addShipRequestQueue.push(request);
  }

  private createBufferedShips(contents: SceneContents)
  {
    for (let request of this.addShipRequestQueue)
    {
      /// DEBUG:
      console.log("Creating ship based on queued request");

      contents.addShip(this.createShip(request));
    }
  }
}

// ----------------- Auxiliary Functions ---------------------
