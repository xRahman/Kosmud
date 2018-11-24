import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Vector } from "../../Shared/Physics/Vector";
import { ShipModel } from "../../Client/FlightScene/ShipModel";
import * as Shared from "../../Shared/Game/Ship";

export class Ship extends Shared.Ship
{
  private readonly model: ShipModel;

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

  // ! Throws exception on error.
  constructor(private readonly scene: FlightScene)
  {
    super();

    /// TODO: Tohle přesunout až do create().
    // ! Throws exception on error.
    // this.graphics = new ShipGraphics(scene, shape);
    /// TODO: Odhackovat (tmp je tu, jen aby to šlo přeložit).
    const tmp: any = {};
    this.model = new ShipModel(scene, tmp);

    /// Tohle jsem přesunul do EnterFlightResponse.createShip().
    // this.setPosition(position);
    // this.setRotation(rotation);
  }

  // ---------------- Public methods --------------------

  public update()
  {
    this.model.update(this.getPosition());
  }

  public setPosition(position: Vector)
  {
    /// V this.physicsBody je 'initialPosition' (aby bylo jasný,
    /// že to je aktuální jen ze začátku), to bych asi úplně setovat neměl...
    /// (měl bych setovat x a y v physicsbody...)
    // this.position.set(position);

    this.model.setPosition(position);
  }

  public setRotation(rotation: number)
  {
    // this.rotation = rotation;

    this.model.setRotation(rotation);
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

  /// TODO: Tohle udělat nějak líp (provolávání přes 3 classy se mi nelíbí)
  public updateExhausts
  (
    forwardThrustRatio: number,
    leftwardThrustRatio: number,
    torqueRatio: number
  )
  {
    this.model.updateExhausts
    (
      forwardThrustRatio,
      leftwardThrustRatio,
      torqueRatio
    );
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