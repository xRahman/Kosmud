/*
  Part of Kosmud

  Rigid body.
*/

// import {PhysicsWorld} from '../../Shared/Physics/PhysicsWorld';

import
{
  b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType, b2FixtureDef
}
from '../../Shared/Box2D/Box2D';

export class PhysicsBody
{
  constructor
  (
    private body: b2Body
    // private world: PhysicsWorld,
    // config: PhysicsBody.Config
  )
  {
    const bodyDefinition = new b2BodyDef();

    bodyDefinition.position.Set(0, 0);

    // this.body = this.world.createBody(bodyDefinition);
  }

  // Scalar value of velocity.
  private velocity = 0;

  public getPosition()
  {
    // let position: GameEntity.Position =
    // {
    //   x: this.getX(),
    //   y: this.getY(),
    //   angle: this.getAngle()
    // };

    // return position;
  }

  public getX()
  {
    // return this.body.position.x;
  }

  public getY()
  {
    // return this.body.position.y;
  }

  public getAngle()
  {
    // return this.body.angle
  }

  public setVelocity(velocity: number)
  {
    this.velocity = velocity;

    this.updateVelocityDirection();
  }

  public setAngularVelocity(velocityRadians: number)
  {
    // Matter.Body.setAngularVelocity(this.body, velocityRadians);
  }

  /// TEST.
  public applyForce()
  {
    // let force: Matter.Vector = { x: 0.01, y: 0.01 };

    // this.body.force = force
  }

  // private getVelocityVector(velocity: number): Matter.Vector
  // {
  //   let velocityVector =
  //   {
  //     x: velocity * Math.cos(this.body.angle),
  //     y: velocity * Math.sin(this.body.angle)
  //   }

  //   return velocityVector;
  // }

  public updateVelocityDirection()
  {
    // Matter.Body.setVelocity(this.body, this.getVelocityVector(this.velocity));
  }
}

// ------------------ Type Declarations ----------------------

export module PhysicsBody
{
  export type Config =
  {
    /// Zatím to dám natvrdo, stejně se to bude nejspíš muset
    /// načítat z exportu z Tiled editoru.
  }
}