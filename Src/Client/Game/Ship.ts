/*  Part of Kosmud  */

import { ZoneUpdate } from "../../Shared/Protocol/ZoneUpdate";
import { Vector } from "../../Shared/Physics/Vector";
import { ShipModel } from "../../Client/Flight/ShipModel";
import { FlightScene } from "../../Client/Flight/FlightScene";
// import { Zone } from "../../Client/Game/Zone";
import { Entities } from "../../Shared/Class/Entities";
import { TilemapAsset } from "../../Client/Asset/TilemapAsset";
import { SoundAsset } from "../../Client/Asset/SoundAsset";
import * as Shared from "../../Shared/Game/Ship";
import { ShapeAsset } from "../../Client/Asset/ShapeAsset";
import { ZeroTo2Pi } from "../../Shared/Utils/ZeroTo2Pi";

export class Ship extends Shared.Ship
{
  private model: ShipModel | "Not created" = "Not created";

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public createModel(scene: FlightScene)
  {
    if (this.model !== "Not created")
      throw Error(`Ship ${this.debugId} already has a model`);

    this.model = new ShipModel
    (
      scene,
      // ! Throws exception on error.
      this.getTilemapAsset().getTilemap(),
      // ! Throws exception on error.
      this.getTextureAsset(),
      // ! Throws exception on error.
      this.getTextureAtlasAsset(),
      // ! Throws exception on error.
      this.getShapeAsset(),
      // ! Throws exception on error.
      this.getExhaustSoundAsset()
      // zone.getTilemap(this.tilemapId),
      // zone.getPhysicsShape(this.physicsShapeId),
      // this.exhaustSoundId
    );
  }

  // ! Throws exception on error.
  public update()
  {
    /// TODO: Správně by se ZoneUpdate packety neměly posílat,
    /// dokud nejsou modely vytvořené.
    // // ! Throws exception on error.
    // this.getModel().update(this);

    if (this.model !== "Not created")
    {
      this.physics.updatePhysicsPositionAndRotation();
      this.model.update(this);
    }
  }

  // ! Throws exception on error.
  // ~ Overrides Shared.Ship.setPosition().
  public setPosition(position: { x: number; y: number })
  {
    // ! Throws exception on error.
    super.setPosition(position);

    // ! Throws exception on error.
    this.getModel().setPosition(position);
  }

  // ! Throws exception on error.
  public setRotation(rotation: ZeroTo2Pi)
  {
    // this.rotation = rotation;

    // ! Throws exception on error.
    this.getModel().setRotation(rotation);
  }

  // ! Throws exception on error.
  public setWaypoint(position: { x: number; y: number })
  {
    // ! Throws exception on error.
    this.physics.setWaypoint(position);
  }

  // --------------- Protected methods ------------------

  // ! Throws exception on error.
  // ~ Overrides Shared.Ship.getTilemapAsset().
  protected getTilemapAsset()
  {
    // ! Throws exception on error.
    return super.getTilemapAsset().dynamicCast(TilemapAsset);
  }

  // ! Throws exception on error.
  // ~ Overrides Shared.Ship.getShapeAsset().
  protected getExhaustSoundAsset()
  {
    // ! Throws exception on error.
    return super.getExhaustSoundAsset().dynamicCast(SoundAsset);
  }

  // ! Throws exception on error.
  // ~ Overrides Shared.Ship.getShapeAsset().
  protected getShapeAsset()
  {
    // ! Throws exception on error.
    return super.getShapeAsset().dynamicCast(ShapeAsset);
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private getModel()
  {
    if (this.model === "Not created")
    {
      throw Error(`Ship ${this.debugId} doesn't have a model yet.`
        + ` Make sure create() is called before whatever has just been`
        + ` called`);
    }

    return this.model;
  }
}

// ------------------ Type Declarations ----------------------

export namespace Ship
{
  export interface Vectors
  {
    shipVelocity: Vector;
    desiredVelocity: Vector;
    steeringForce: Vector;
    desiredSteeringForce: Vector;
    desiredForwardSteeringForce: Vector;
    desiredLeftwardSteeringForce: Vector;
  }
}

Entities.createRootPrototypeEntity(Ship);