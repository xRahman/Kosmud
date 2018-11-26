import { SceneUpdate } from "../../Shared/Protocol/SceneUpdate";
import { Vector } from "../../Shared/Physics/Vector";
import { ShipModel } from "../../Client/FlightScene/ShipModel";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Zone } from "../../Client/Game/Zone";
import * as Shared from "../../Shared/Game/Ship";

export class Ship extends Shared.Ship
{
  private model: ShipModel | "Not created" = "Not created";

  /// Tohle je zděděný z Vehicle.
  // private readonly vectors: Ship.Vectors =
  // {
  //   shipVelocity: new Vector(),
  //   desiredVelocity: new Vector(),
  //   steeringForce: new Vector(),
  //   desiredSteeringForce: new Vector(),
  //   desiredForwardSteeringForce: new Vector(),
  //   desiredLeftwardSteeringForce: new Vector()
  // };

  // // ! Throws exception on error.
  // constructor(private readonly scene: FlightScene)
  // {
  //   super();
  // }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  /// TODO: Tohle by se možná mohlo jmenovat createModel().
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
      this.engineSoundId
    );
  }

  // ! Throws exception on error.
  public update(shipState: SceneUpdate.ShipState)
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
  public setPosition(position: Vector)
  {
    /// V this.physicsBody je 'initialPosition' (aby bylo jasný,
    /// že to je aktuální jen ze začátku), to bych asi úplně setovat neměl...
    /// (měl bych setovat x a y v physicsbody...)
    // this.position.set(position);

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

  public setVectors(vectors: Ship.Vectors)
  {
    // this.velocity.set(vectors.shipVelocity);
    this.desiredVelocity.set(vectors.desiredVelocity);
    this.steeringForce.set(vectors.steeringForce);
    this.desiredSteeringForce.set(vectors.desiredSteeringForce);
    this.desiredForwardSteeringForce.set
    (
      vectors.desiredForwardSteeringForce
    );
    this.desiredLeftwardSteeringForce.set
    (
      vectors.desiredLeftwardSteeringForce
    );

    /// TODO: Znovu zprovoznit.
    // this.graphics.drawVectors(this.vectors);
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