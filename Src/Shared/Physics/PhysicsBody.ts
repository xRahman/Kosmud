/*
  Part of Kosmud

  Rigid body.
*/

import { Vector } from "Shared/Physics/Vector";

import { b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType,
  b2FixtureDef, b2Shape, b2ShapeType } from "Shared/Box2D/Box2D";

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
    return new Vector(this.body.GetPosition());
  }

  public getX()
  {
    return this.body.GetPosition().x;
  }

  public getY()
  {
    return this.body.GetPosition().y;
  }

  public getAngle()
  {
    return this.body.GetAngle();
  }

  public setVelocity(velocity: number)
  {
    this.velocity = velocity;

    this.updateVelocityDirection();
  }

  public setAngularVelocity(velocityRadians: number)
  {
    this.body.SetAngularVelocity(velocityRadians);
  }

  public applyForce(force: Vector)
  {
    this.body.ApplyForceToCenter(force);
  }

  public getVelocity(): Vector
  {
    return new Vector(this.body.GetLinearVelocity());
  }

  // private getVelocityVector(velocity: number)
  // {
  //   let velocityVector =
  //   {
  //     x: velocity * Math.cos(this.getAngle()),
  //     y: velocity * Math.sin(this.getAngle())
  //   }

  //   return velocityVector;
  // }

  public updateVelocityDirection()
  {
    // this.body.SetLinearVelocity(this.getVelocityVector(this.velocity));
    this.body.SetLinearVelocity(this.getVelocity());
  }

  public getGeometry()
  {
    const geometry: PhysicsBody.Geometry = [];

    for
    (
      let fixture = this.body.GetFixtureList();
      fixture !== null;
      fixture = fixture.GetNext()
    )
    {
      const shapeType = fixture.GetType();

      if (shapeType === b2ShapeType.e_polygonShape)
      {
        const vertices = (fixture.GetShape() as b2PolygonShape).m_vertices;

        const polygon: PhysicsBody.Polygon = [];

        for (const vertex of vertices)
        {
          polygon.push({ x: vertex.x, y: vertex.y });
        }

        geometry.push(polygon);
      }
    }

    return geometry;
  }
}

// ------------------ Type Declarations ----------------------

export namespace PhysicsBody
{
  export type Config =
  {
    /// Zatím to dám natvrdo, stejně se to bude nejspíš muset
    /// načítat z exportu z Tiled editoru.
  };

  export type Polygon = Array<{ x: number; y: number }>;

  export type Geometry = Array<Polygon>;
}