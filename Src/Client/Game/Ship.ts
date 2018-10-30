import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Vector } from "../../Shared/Physics/Vector";
import { SceneUpdate } from "../../Client/Protocol/SceneUpdate";
import { ShipGraphics } from "../../Client/FlightScene/ShipGraphics";

export class Ship
{
  private graphics: ShipGraphics;

  private vectors: Ship.Vectors =
  {
    desiredVelocity: new Vector(),
    steeringForce: new Vector(),
    desiredSteeringForce: new Vector()
  };

  constructor
  (
    private scene: Phaser.Scene,
    private shape: PhysicsBody.Shape,
    position: Vector,
    rotation: number
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
    this.graphics.setPosition(position);
  }

  public setRotation(rotation: number)
  {
    this.graphics.setRotation(rotation);
  }

  public getPosition(): Vector
  {
    return this.graphics.getPosition();
  }

  public setVectors(vectors: Ship.Vectors)
  {
    this.vectors.desiredVelocity.set(vectors.desiredVelocity);
    this.vectors.steeringForce.set(vectors.steeringForce);
    this.vectors.desiredSteeringForce.set(vectors.desiredSteeringForce);

    this.graphics.drawVectors(this.vectors);
  }
}

// ------------------ Type Declarations ----------------------

export namespace Ship
{
  export interface Vectors
  {
    desiredVelocity: Vector;
    steeringForce: Vector;
    desiredSteeringForce: Vector;
  }
}