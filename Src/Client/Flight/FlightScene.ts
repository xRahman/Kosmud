/*  Part of Kosmud  */

// import { Ship } from "../../Client/Game/Ship";
// import { Asset } from "../../Shared/Asset/Asset";
import { Zone } from "../../Client/Game/Zone";
import { FlightSceneInput } from "../../Client/Flight/FlightSceneInput";
import { FlightSceneGUI } from "../../Client/Flight/FlightSceneGUI";
import { Scene } from "../../Client/Engine/Scene";
import { Connection } from "../../Client/Net/Connection";

interface AnimatedTilesPlugin
{
  init(map: Phaser.Tilemaps.Tilemap): void;
}

export class FlightScene extends Scene
{
  public animatedTilesPlugin: AnimatedTilesPlugin | "Not loaded" =
    "Not loaded";

  // ~ Overrides Scene.input.
  protected input: FlightSceneInput | "Doesn't exist" = "Doesn't exist";

  private zone: Zone | "Not set" = "Not set";

  private sceneGUI: FlightSceneGUI | "Doesn't exist" = "Doesn't exist";

  // ---------------- Public methods --------------------

  public setZone(zone: Zone)
  {
    this.zone = zone;
  }

  // ! Throws exception on error.
  // ~ Overrides Scene.init().
  public init()
  {
    super.init();

    this.updateCamera();

    /// TODO: Tohle teď jen setne odkaz na scénu,
    ///   přepsat to jinak.
    // ! Throws exception on error.
    this.getZone().initSceneData(this);

    // ! Throws exception on error.
    this.getZone().createModels();

    // ! Throws exception on error.
    this.createSceneGUI();

    // ! Throws exception on error.
    this.createInput();

    this.setActive(true);
  }

  public moveWaypoint(position: { x: number; y: number })
  {
    Connection.getPlayer().getActiveShip().setWaypoint(position);

    return this.getSceneGUI().moveWaypoint(position);
  }

  // --------------- Protected methods ------------------

  /// To be deleted
  /// Zóna už se nesetuje do connection
  /// (Player má activeShip a ta ví, ve které je zóně).
  // // ~ Overrides Scene.activate().
  // protected activate()
  // {
  //   super.setActive(true);

  //   Connection.setZone(this.getZone());
  // }

  protected loadPlugins()
  {
    this.loadAnimatedTilesPlugin();
  }

  // ! Throws exception on error.
  protected loadAssets()
  {
    /// TODO: Tohle předělat (SceneGUI assety je třeba přidat do seznamu
    ///   assetů ve scéně coby entity)
    FlightSceneGUI.loadAssets(this);

    /// Tohle je teď jinak, assety na klientu loaduje scéna, ne zóna.
    // // ! Throws exception on error.
    // this.getZone().loadAssets(this);
  }

  // ! Throws exception on error.
  // ~ Overrides Scene.update().
  // 'update()' is called in every rendering tick.
  protected update()
  {
    super.update();

    // // ! Throws exception on error.
    // this.getSceneGUI().update();

    this.getInput().update();
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private getInput()
  {
    if (this.input === "Doesn't exist")
    {
      throw Error(`Scene ${this.debugId} doesn't have input active yet`);
    }

    return this.input;
  }

  // ! Throws exception on error.
  private getSceneGUI()
  {
    if (this.sceneGUI === "Doesn't exist")
    {
      throw Error(`Scene GUI doesn't exists yet in ${this.debugId}`);
    }

    return this.sceneGUI;
  }

  // ! Throws exception on error.
  private createSceneGUI()
  {
    if (this.sceneGUI !== "Doesn't exist")
    {
      throw Error(`Scene GUI already exists in ${this.debugId}`);
    }

    this.sceneGUI = new FlightSceneGUI(this);
  }

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
    if (this.zone === "Not set")
    {
      throw Error(`Scene '${this.name}' doesn't have`
        + ` a zone attached yet. Make sure you call setZone()`
        + ` before you start this scene`);
    }

    return this.zone;
  }

  // ! Throws exception on error.
  private createInput()
  {
    if (this.input !== "Doesn't exist")
    {
      throw Error(`Failed to create input in ${this.debugId}`
        + ` because it already exists`);
    }

    this.input = new FlightSceneInput(this);
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
