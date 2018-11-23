import { Physics } from "../../Shared/Physics/Physics";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Vector } from "../../Shared/Physics/Vector";
import { ShipGraphics } from "../../Client/FlightScene/ShipGraphics";
import { ShipSound } from "../../Client/FlightScene/ShipSound";
import { ShipExhausts } from "../../Client/Game/ShipExhausts";
import * as Shared from "../../Shared/Game/Ship";

export class Ship extends Shared.Ship
{
  private readonly exhausts: ShipExhausts;
  private readonly graphics: ShipGraphics;
  private readonly sound: ShipSound;

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

    // ! Throws exception on error.
    // this.graphics = new ShipGraphics(scene, shape);
    /// TODO: Odhackovat (tmp je tu, jen aby to šlo přeložit).
    const tmp: any = {};
    this.graphics = new ShipGraphics(scene, tmp);
    this.sound = new ShipSound(scene);

    // ! Throws exception on error.
    this.exhausts = new ShipExhausts(this.graphics, this.sound);

    /// Tohle jsem přesunul do EnterFlightResponse.createShip().
    // this.setPosition(position);
    // this.setRotation(rotation);
  }

  // ---------------- Public methods --------------------

  public update()
  {
    this.graphics.update(this.getPosition());
  }

  public setPosition(position: Vector)
  {
    /// V this.physicsBody je 'initialPosition' (aby bylo jasný,
    /// že to je aktuální jen ze začátku), to bych asi úplně setovat neměl...
    /// (měl bych setovat x a y v physicsbody...)
    // this.position.set(position);

    this.graphics.setPosition(position);
  }

  public setRotation(rotation: number)
  {
    // this.rotation = rotation;

    this.graphics.setRotation(rotation);
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

  public updateExhausts
  (
    forwardThrustRatio: number,
    leftwardThrustRatio: number,
    torqueRatio: number
  )
  {
    this.exhausts.update
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