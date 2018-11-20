import { ShipToScene } from "../../Client/Protocol/ShipToScene";
import { Ship } from "../../Client/Game/Ship";
import { FlightSceneContents }
  from "../../Client/FlightScene/FlightSceneContents";
import { Scene } from "../../Client/Engine/Scene";
import { REPORT } from "../../Shared/Log/REPORT";
import { ERROR } from "../../Shared/Log/ERROR";

interface AnimatedTilesPlugin
{
  init(map: Phaser.Tilemaps.Tilemap): void;
}

const FLIGHT_SCENE = "Flight scene";

export class FlightScene extends Scene
{
  public animatedTilesPlugin: AnimatedTilesPlugin | "Not loaded" =
    "Not loaded";

  // ~ Overrides Scene.contents.
  protected contents: FlightSceneContents | "Doesn't exist" = "Doesn't exist";

  private readonly addRequestQueue = new Array<ShipToScene>();

  constructor
  (
    width: number,
    height: number
  )
  {
    super(FLIGHT_SCENE, width, height);
  }

  // ---------------- Public methods --------------------

  public getShip(): Ship | "Doesn't exist"
  {
    if (this.contents === "Doesn't exist")
      return "Doesn't exist";

    return this.contents.ship;
  }

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
    this.preloadAnimatedTilesPlugin();

    FlightSceneContents.preload(this);
  }

  // This method is run by Phaser.
  public create()
  {
    if (this.contents !== "Doesn't exist")
    {
      ERROR(`Failed to create scene '${this.name}'`
        + ` because scene contents already exist`);
    }

    this.contents = new FlightSceneContents(this, this.width, this.height);

    /// TEST
    // this.contents.create(this);

    try
    {
      this.createBufferedShips(this.contents);
    }
    catch (error)
    {
      REPORT(error, "Failed to add ships to flight scene");
    }
  }

  // This method is run periodically by Phaser.
  public update()
  {
    if (this.contents === "Doesn't exist")
    {
      ERROR(`Failed to update scene '${this.name}'`
        + ` because scene contents doesn't exist`);
      return;
    }

    this.contents.update();
  }

  // ! Throws exception on error.
  // ~ Overrides Scene.resize().
  public resize(width: number, height: number)
  {
    super.resize(width, height);

    // If scene contents isn't created yet, there is nothing
    // to resize (this can happen when loading takes a long time
    // and user toggles Chrome debug console, resizes browser
    // window or something like that).
    if (this.contents === "Doesn't exist")
      return;

    // ! Throws exception on error.
    this.contents.background.resize(width, height);

    /// (Musí se tohle volat?)
    /// - Nejspíš nemusí.
    // this.cameras.resize(width, height);
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private createShip(request: ShipToScene): Ship
  {
    // ! Throws exception on error.
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
    this.addRequestQueue.push(request);
  }

  // ! Throws exception on error.
  private createBufferedShips(contents: FlightSceneContents)
  {
    for (const request of this.addRequestQueue)
    {
      contents.addShip
      (
        // ! Throws exception on error.
        this.createShip(request)
      );
    }
  }

  private preloadAnimatedTilesPlugin()
  {
    this.load.scenePlugin
    (
      {
        // Key is not used anywhere (we let loader assign the plugin
        // directly to property of FlightScene) but it is required
        // parameter so we make something up to make loader happy.
        key: "AnimatedTiles",
        // Path relative to /Client where plugin code is located.
        url: "js/phaser/AnimatedTiles.js",
        // Name of the property of FlightScene to assign the plugin to.
        sceneKey: "animatedTilesPlugin"
      }
    );
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