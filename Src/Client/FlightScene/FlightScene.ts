import { ShipToScene } from "../../Client/Protocol/ShipToScene";
// import { Background } from "../../Client/FlightScene/Background";
import { Ship } from "../../Client/Game/Ship";
// import { Waypoint } from "../../Client/FlightScene/Waypoint";
import { FlightSceneContents }
  from "../../Client/FlightScene/FlightSceneContents";
import { Scene } from "../../Client/Phaser/Scene";

export class FlightScene extends Scene
{
  // ~ Overrides Scene.contents.
  protected contents: FlightSceneContents | "Doesn't exist" = "Doesn't exist";

  private readonly addRequestQueue = new Array<ShipToScene>();

  constructor
  (
    width: number,
    height: number
  )
  {
    super("Flight scene", width, height);
  }

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
    FlightSceneContents.preload(this);
  }

  // ! Throws exception on error.
  // This method is run by Phaser.
  public create()
  {
    if (this.contents !== "Doesn't exist")
    {
      throw new Error(`Failed to create scene '${this.name}'`
        + ` because scene contents already exist`);
    }

    this.contents = new FlightSceneContents(this, this.width, this.height);

    this.contents.create(this);

    this.createBufferedShips(this.contents);
  }

  // This method is run periodically by Phaser.
  public update()
  {
    if (this.contents === "Doesn't exist")
    {
      throw new Error(`Failed to update scene '${this.name}'`
        + ` because scene contents doesn't exist`);
    }

    this.contents.update();
  }

  // ! Throws exception on error.
  // ~ Overrides Scene.resize().
  public resize(width: number, height: number)
  {
    super.resize(width, height);

    if (this.contents === "Doesn't exist")
    {
      throw new Error(`Failed to resize scene '${this.name}'`
        + ` because scene contents doesn't exist`);
    }

    this.contents.background.resize(width, height);

    /// (Musí se tohle volat?)
    /// - Nejspíš nemusí.
    // this.cameras.resize(width, height);
  }

  // ---------------- Private methods -------------------

  private createShip(request: ShipToScene): Ship
  {
    return new Ship
    (
      this,
      request.shipShape,
      request.shipPosition,
      request.shipRotation
    );
  }

  private queueAddShipRequest(request: ShipToScene)
  {
    /// DEBUG:
    // console.log("Queueing ship add request");

    this.addRequestQueue.push(request);
  }

  private createBufferedShips(contents: FlightSceneContents)
  {
    for (const request of this.addRequestQueue)
    {
      /// DEBUG:
      // console.log("Creating ship based on queued request");

      contents.addShip(this.createShip(request));
    }
  }
}

// ------------------ Type Declarations ----------------------

export namespace FlightScene
{
  export const Z_ORDER_OBSTACLES = Scene.Z_ORDER_DEFAULT + 1;
  export const Z_ORDER_WAYPOINTS = Z_ORDER_OBSTACLES + 1;
  export const Z_ORDER_SHIPS = Z_ORDER_WAYPOINTS + 1;
  export const Z_ORDER_DEBUG = Z_ORDER_SHIPS + 1;
}