import { ZoneUpdate } from "../../Shared/Protocol/ZoneUpdate";
import { Vector } from "../../Shared/Physics/Vector";
import { ShipModel } from "../../Client/Flight/ShipModel";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { Zone } from "../../Client/Game/Zone";
import * as Entities from "../../Shared/Class/Entities";
import * as Shared from "../../Shared/Game/Ship";

export class Ship extends Shared.Ship
{
  private model: ShipModel | "Not created" = "Not created";

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  /// TODO: Ship (obecně game entity) asi má odkaz na zónu, ve které
  ///   se nachází - takže parametr asi není potřeba.
  public createModel(scene: FlightScene, zone: Zone)
  {

    if (this.model !== "Not created")
    {
      throw new Error(`Ship ${this.debugId} already has a model`);
    }

    this.model = new ShipModel
    (
      scene,
      // ! Throws exception on error.
      zone.getTilemap(this.tilemapId),
      zone.getPhysicsShape(this.physicsShapeId),
      this.exhaustSoundId
    );
  }

  // ! Throws exception on error.
  public update(shipState: ZoneUpdate.ShipState)
  {
    this.setPosition(shipState.shipPosition);
    this.setRotation(shipState.shipRotation);

    this.setVectors(shipState);

    // ! Throws exception on error.
    this.getModel().updateExhausts
    (
      shipState.forwardThrustRatio,
      shipState.leftwardThrustRatio,
      shipState.torqueRatio
    );
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
  public setRotation(rotation: number)
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

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private getModel()
  {
    if (this.model === "Not created")
    {
      throw new Error(`Ship ${this.debugId} doesn't have a model yet.`
        + ` Make sure create() is called before whatever has just been`
        + ` called`);
    }

    return this.model;
  }

  private setVectors(shipState: ZoneUpdate.ShipState)
  {
    this.physics.setVelocity(shipState.shipVelocity);
    this.physics.desiredVelocity.set(shipState.desiredVelocity);
    this.physics.steeringForce.set(shipState.steeringForce);
    // this.physics.desiredSteeringForce.set(shipState.desiredSteeringForce);
    // this.physics.desiredForwardSteeringForce.set
    // (
    //   shipState.desiredForwardSteeringForce
    // );
    // this.physics.desiredLeftwardSteeringForce.set
    // (
    //   shipState.desiredLeftwardSteeringForce
    // );

    // this.physics.brakingDistance = shipState.brakingDistance;
    // this.physics.stoppingDistance = shipState.stoppingDistance;
    // this.physics.desiredRotation.set(shipState.desiredRotation);

    // ! Throws exception on error.
    this.getModel().drawVectors(this);
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