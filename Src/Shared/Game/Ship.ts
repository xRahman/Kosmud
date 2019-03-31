/*  Part of Kosmud  */

// import { Zone } from "../../Shared/Game/Zone";
import { TilemapAsset } from "../Asset/TilemapAsset";
import { SoundAsset } from "../Asset/SoundAsset";
import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
import { Vehicle } from "../../Shared/Game/Vehicle";

export class Ship extends Vehicle
{
  private tilemapAsset: TilemapAsset | "Not set" = "Not set";
  private exhaustSoundAsset: SoundAsset | "Not set" = "Not set";
  // Tohle je v .physics
  // protected readonly physicsShapeId = Zone.FIGHTER_SHAPE_ID;

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public setPosition(position: { x: number; y: number })
  {
    // ! Throws exception on error.
    this.physics.setPosition(position);
  }

  // ! Throws exception on error.
  public setTilemapAsset(asset: TilemapAsset)
  {
    if (this.tilemapAsset !== "Not set")
      // ! Throws exception on error.
      this.removeAsset(this.tilemapAsset);

    // ! Throws exception on error.
    this.tilemapAsset = this.addAsset(asset);
  }

  // ! Throws exception on error.
  public setExhaustSoundAsset(asset: SoundAsset)
  {
    if (this.exhaustSoundAsset !== "Not set")
      // ! Throws exception on error.
      this.removeAsset(this.exhaustSoundAsset);

    // ! Throws exception on error.
    this.exhaustSoundAsset = this.addAsset(asset);
  }

  // ! Throws exception on error.
  public setShapeAsset(asset: ShapeAsset)
  {
    // ! Throws exception on error.
    this.physics.setShapeAsset(asset);
  }

  // --------------- Protected methods ------------------

  protected getTilemapAsset()
  {
    if (this.tilemapAsset === "Not set")
    {
      throw new Error(`${this.debugId} doesn't have tilemap asset`);
    }

    return this.tilemapAsset;
  }

  protected getExhaustSoundAsset()
  {
    if (this.exhaustSoundAsset === "Not set")
    {
      throw new Error(`${this.debugId} doesn't have exhaust sound asset`);
    }

    return this.exhaustSoundAsset;
  }

  // ! Throws exception on error.
  protected getShapeAsset()
  {
    // ! Throws exception on error.
    return this.physics.getShapeAsset();
  }
}