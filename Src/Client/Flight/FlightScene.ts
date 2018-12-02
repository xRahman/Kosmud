import { Ship } from "../../Client/Game/Ship";
import { Zone } from "../../Client/Game/Zone";
import { FlightSceneContents }
  from "../../Client/Flight/FlightSceneContents";
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

  // --------------- Protected methods ------------------

  // ~ Overrides Scene.activate().
  protected activate()
  {
    super.setActive(true);

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

    FlightSceneContents.loadAssets(this);
  }

  // ! Throws exception on error.
  // ~ Overrides Scene.update().
  // 'update()' is called in every rendering tick.
  protected update()
  {
    if (this.contents === "Doesn't exist")
    {
      throw new Error(`Scene contents doesn't exist`);
    }

    this.contents.update();
  }

  // ---------------- Private methods -------------------

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
      throw new Error(`Failed to create ${this.debugId}`
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
}

// ------------------ Type Declarations ----------------------

export namespace FlightScene
{
  export const Z_ORDER_OBSTACLES = Scene.Z_ORDER_DEFAULT + 1;
  export const Z_ORDER_WAYPOINTS = Z_ORDER_OBSTACLES + 1;
  export const Z_ORDER_SHIPS = Z_ORDER_WAYPOINTS + 1;
  export const Z_ORDER_DEBUG = Z_ORDER_SHIPS + 1;
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function fakeCreateShip()
{
  const ship = new Ship();
  ship.setId("TEST_FIGHTER_ID");
  ship.physics.shapeId = Zone.FIGHTER_SHAPE_ID;

  return ship;
}