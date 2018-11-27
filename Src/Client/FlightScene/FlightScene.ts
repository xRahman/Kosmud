import { ERROR } from "../../Shared/Log/ERROR";
import { Ship } from "../../Client/Game/Ship";
import { Zone } from "../../Client/Game/Zone";
import { FlightSceneContents }
  from "../../Client/FlightScene/FlightSceneContents";
import { Scene } from "../../Client/Engine/Scene";
import { Connection } from "../Net/Connection";

interface AnimatedTilesPlugin
{
  init(map: Phaser.Tilemaps.Tilemap): void;
}

export class FlightScene extends Scene
{
  public animatedTilesPlugin: AnimatedTilesPlugin | "Not loaded" =
    "Not loaded";

  // ~ Overrides Scene.contents.
  protected contents: FlightSceneContents | "Doesn't exist" = "Doesn't exist";

  private zone: Zone | "Not assigned" = "Not assigned";

  // private readonly addRequestQueue = new Array<EnterFlightResponse>();

  constructor(name: string)
  {
    super(name);
  }

  // ---------------- Public methods --------------------

  public setZone(zone: Zone)
  {
    this.zone = zone;
  }

  public init()
  {
    // ! Throws exception on error.
    this.getZone().initSceneData(this);

    // ! Throws exception on error.
    this.getZone().addShip(fakeCreateShip());

    // ! Throws exception on error.
    this.getZone().createModels();

    // ! Throws exception on error.
    this.initContents();

    this.activate();
  }

  /// Lodě jsou teď ve scéně.
  // public getShip(): Ship | "Doesn't exist"
  // {
  //   if (this.contents === "Doesn't exist")
  //     return "Doesn't exist";

  //   console.log(this.contents);

  //   return this.contents.ship;
  // }

  /// Tohle si tu nechám, protože časem se budou posílat ZoneUpdaty,
  /// ve kterých budou nové lodě do scény. Imho se to ale bude dělat jinak.
  // public addShip(request: EnterFlightResponse)
  // {
  //   if (this.contents === "Doesn't exist")
  //   {
  //     this.queueAddShipRequest(request);
  //   }
  //   else
  //   {
  //     this.contents.addShip(this.createShip(request));
  //   }
  // }

  // // ! Throws exception on error.
  // // This method is run by Phaser.
  // public preload()
  // {
  //   // ! Throws exception on error.
  //   this.getZone().loadAssets(this);
  //   /// Zóna se bude posílat v rámci EnterFlightResponse. V ten moment se
  //   /// asi bude teprve vyrábět FlightScene, takže zóna by měla nejspíš už
  //   /// existovat a bejt setnutá do FlightScene. Takže tady prostě vezmu
  //   /// this.zone.

  //   /// TODO: Preload dat podle toho, co je uloženo v zóně.
  //   ///  (asi by se tu mohlo volat zone.preload() nebo zone.init()
  //   ///   s tím, že parametr bude json object preloadnutých tilemap
  //   ///   - i když blbost, zone.init() se asi bude dělat až v creatu(),
  //   ///   tady se jen zavolá loadování).

  //   this.preloadAnimatedTilesPlugin();

  //   FlightSceneContents.preload(this);
  // }

  // // This method is run by Phaser.
  // public create()
  // {
  //   // ! Throws exception on error.
  //   this.getZone().create(this);

  //   this.getZone().addShip(fakeCreateShip());

  //   if (this.contents !== "Doesn't exist")
  //   {
  //     ERROR(`Failed to create scene '${this.name}'`
  //       + ` because scene contents already exists`);
  //   }

  //   this.contents = new FlightSceneContents
  //   (
  //     this,
  //     this.phaserScene.input,
  //     this.width,
  //     this.height
  //   );

  //   this.activate();

  //   /// TEST
  //   // this.contents.create(this);

  //   // try
  //   // {
  //   //   this.createBufferedShips(this.contents);
  //   // }
  //   // catch (error)
  //   // {
  //   //   REPORT(error, "Failed to add ships to flight scene");
  //   // }
  // }

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

  // --------------- Protected methods ------------------

  // ~ Overrides Scene.activate().
  protected activate()
  {
    super.activate();

    Connection.setZone(this.getZone());
  }

  protected loadPlugins()
  {
    this.loadAnimatedTilesPlugin();
  }

  // ! Throws exception on error.
  protected loadAssets()
  {
    // ! Throws exception on error.
    this.getZone().loadAssets(this);

    FlightSceneContents.preload(this);
  }

  // ---------------- Private methods -------------------

  // // ! Throws exception on error.
  // private createShip(request: EnterFlightResponse): Ship
  // {
  //   // ! Throws exception on error.
  //   return new Ship
  //   (
  //     this,
  //     request.shipShape,
  //     request.shipPosition,
  //     request.shipRotation
  //   );
  // }

  // private queueAddShipRequest(request: EnterFlightResponse)
  // {
  //   this.addRequestQueue.push(request);
  // }

  // ! Throws exception on error.
  // private createBufferedShips(contents: FlightSceneContents)
  // {
  //   for (const request of this.addRequestQueue)
  //   {
  //     contents.addShip
  //     (
  //       // ! Throws exception on error.
  //       this.createShip(request)
  //     );
  //   }
  // }

  private loadAnimatedTilesPlugin()
  {
    this.loadScenePlugin
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

  // ! Throws exception on error.
  private getZone()
  {
    if (this.zone === "Not assigned")
    {
      throw new Error(`Scene '${this.name}' doesn't have`
        + ` a zone attached yet. Make sure you call setZone()`
        + ` before you start this scene`);
    }

    return this.zone;
  }

  // ! Throws exception on error.
  private initContents()
  {
    if (this.contents !== "Doesn't exist")
    {
      ERROR(`Failed to create scene '${this.name}'`
        + ` because scene contents already exists`);
    }

    this.contents = new FlightSceneContents
    (
      this,
      this.phaserScene.input,
      this.width,
      this.height
    );
  }

  // ---------------- Event handlers --------------------

  // ~ Overrides Scene.onUpdate().
  protected onUpdate()
  {
    if (this.contents === "Doesn't exist")
    {
      ERROR(`Failed to update scene '${this.name}'`
        + ` because scene contents doesn't exist`);
      return;
    }

    this.contents.update();
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

// ! Throws exception on error.
function fakeCreateShip()
{
  const ship = new Ship();
  ship.setId("TEST_FIGHTER_ID");

  /// Pozice se bude posílat ze serveru.
  // ship.setInitialPosition(this.shipPosition);
  // ship.setInitialRotation(this.shipRotation);

  /// TEST
  ship.setShapeId(Zone.FIGHTER_SHAPE_ID);

  return ship;
}