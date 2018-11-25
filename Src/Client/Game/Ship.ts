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
  public create(scene: FlightScene, zone: Zone)
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
  public update()
  {
    // ! Throws exception on error.
    this.getModel().update(this.getPosition());
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

  // ! Throws exception on error.
  /// TODO: Tohle udělat nějak líp (provolávání přes 3 classy se mi nelíbí)
  public updateExhausts
  (
    forwardThrustRatio: number,
    leftwardThrustRatio: number,
    torqueRatio: number
  )
  {
    // ! Throws exception on error.
    this.getModel().updateExhausts
    (
      forwardThrustRatio,
      leftwardThrustRatio,
      torqueRatio
    );
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private getModel()
  {
    if (this.model === "Not created")
    {
      throw new Error(`Ship ${this.debugId} doesn't have a model yet`
        + ` make sure create() is called before whatever has just been`
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