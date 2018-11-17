/*
  Part of Kosmud

  Rigid body.
*/

import { validateNumber, validateVector } from "../../Shared/Utils/Math";
import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
import { Vector } from "../../Shared/Physics/Vector";

// 3rd party modules.
import { b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType,
  b2FixtureDef, b2Shape, b2ShapeType } from "../../Shared/Box2D/Box2D";

export class PhysicsBody
{
  private velocity = 0;
  private readonly body: b2Body;

  constructor(world: b2World)
  {
    const bodyDefinition = new b2BodyDef();

    bodyDefinition.position.Set(0, 0);
    bodyDefinition.type = b2BodyType.b2_dynamicBody;

    this.body = world.CreateBody(bodyDefinition);

    const shape = new b2PolygonShape();

    /// Zatím natvrdo.
    shape.SetAsBox(100, 100);

    const fixtureDefinition = new b2FixtureDef();

    fixtureDefinition.shape = shape;
    // density * area = mass
    fixtureDefinition.density = 0.00001;
    // 0 - no friction, 1 - maximum friction
    fixtureDefinition.friction = 0.5;
    // 0 - almost no bouncing, 1 - maximum bouncing.
    fixtureDefinition.restitution = 1;

    this.body.CreateFixture(fixtureDefinition);
  }

  public getPosition()
  {
    return validateVector(this.body.GetPosition());
  }

  public getX()
  {
    return validateNumber(this.body.GetPosition().x);
  }

  public getY()
  {
    return validateNumber(this.body.GetPosition().y);
  }

  public getRotation()
  {
    return validateNumber(this.body.GetAngle());
  }

  public getAngularVelocity()
  {
    return validateNumber(this.body.GetAngularVelocity());
  }

  // Inertia is resistance to torque.
  public getInertia()
  {
    return validateNumber(this.body.GetInertia());
  }

  // Mass is resistance to linear force.
  public getMass()
  {
    return validateNumber(this.body.GetMass());
  }

  public setVelocity(velocity: number)
  {
    this.velocity = validateNumber(velocity);

    this.updateVelocityDirection();
  }

  public setAngularVelocity(angularVelocity: number)
  {
    this.body.SetAngularVelocity(validateNumber(angularVelocity));
  }

  public applyForce(force: Vector)
  {
    this.body.ApplyForceToCenter(validateVector(force));
  }

  public applyTorque(torque: number)
  {
    this.body.ApplyTorque(validateNumber(torque));
  }

  public getVelocity(): Vector
  {
    return validateVector(this.body.GetLinearVelocity());
  }

  // private getVelocityVector(velocity: number)
  // {
  //   let velocityVector =
  //   {
  //     x: velocity * Math.cos(this.getRotation()),
  //     y: velocity * Math.sin(this.getRotation())
  //   }

  //   return velocityVector;
  // }

  public updateVelocityDirection()
  {
    this.body.SetLinearVelocity(this.getVelocity());
  }

  public getShape()
  {
    const shape: PhysicsBody.Shape = [];

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
          polygon.push
          (
            {
              x: validateNumber(vertex.x),
              y: validateNumber(vertex.y)
            }
          );
        }

        shape.push(polygon);
      }
    }

    return shape;
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

  export type Shape = Array<Polygon>;
}