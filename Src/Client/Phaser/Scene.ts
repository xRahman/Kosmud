import {Background} from '../../Client/Phaser/Background';
import {Ship} from '../../Client/Phaser/Ship';
import {SceneContents} from '../../Client/Phaser/SceneContents';

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

  private contents: SceneContents | "Doesn't exist" = "Doesn't exist";

  // --------------- Public accessors -------------------

  public getShip(): Ship | "Doesn't exist" 
  {
    if (this.contents === "Doesn't exist")
      return "Doesn't exist";

    return this.contents.ship;
  }

  // ---------------- Public methods --------------------

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

    this.createBufferedShips();
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

  private createBufferedShips()
  {
    /// TODO: projít buffer s ShipToScene packetama, přidat lodě do scény.
  }
}

// ----------------- Auxiliary Functions ---------------------
