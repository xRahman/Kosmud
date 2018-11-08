import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Vector } from "../../Shared/Physics/Vector";
import { SceneUpdate } from "../../Client/Protocol/SceneUpdate";
import { ShipGraphics } from "../../Client/FlightScene/ShipGraphics";

export class Ship
{
  private readonly graphics: ShipGraphics;

  private readonly vectors: Ship.Vectors =
  {
    shipVelocity: new Vector(),
    desiredVelocity: new Vector(),
    steeringForce: new Vector(),
    desiredSteeringForce: new Vector(),
    desiredForwardSteeringForce: new Vector(),
    desiredLeftwardSteeringForce: new Vector()
  };

  constructor
  (
    private readonly scene: Phaser.Scene,
    private readonly shape: PhysicsBody.Shape,
    private readonly position: Vector,
    private rotation: number
  )
  {
    this.graphics = new ShipGraphics(scene, shape);

    this.setPosition(position);
    this.setRotation(rotation);
  }

  // ---------------- Public methods --------------------

  public update()
  {
    this.graphics.update(this.getPosition());
  }

  public setPosition(position: Vector)
  {
    this.position.set(position);

    this.graphics.setPosition(position);
  }

  public getPosition(): Vector
  {
    return this.position;
  }

  public setRotation(rotation: number)
  {
    this.rotation = rotation;

    this.graphics.setRotation(rotation);
  }

  public getRotation(): number
  {
    return this.rotation;
  }

  public setVectors(vectors: Ship.Vectors)
  {
    this.vectors.shipVelocity.set(vectors.shipVelocity);
    this.vectors.desiredVelocity.set(vectors.desiredVelocity);
    this.vectors.steeringForce.set(vectors.steeringForce);
    this.vectors.desiredSteeringForce.set(vectors.desiredSteeringForce);
    this.vectors.desiredForwardSteeringForce.set
    (
      vectors.desiredForwardSteeringForce
    );
    this.vectors.desiredLeftwardSteeringForce.set
    (
      vectors.desiredLeftwardSteeringForce
    );

    this.graphics.drawVectors(this.vectors);
  }

  public updateExhausts
  (
    forwardThrustRatio: number,
    leftwardThrustRatio: number,
    torqueRatio: number
  )
  {
    this.graphics.updateExhausts
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