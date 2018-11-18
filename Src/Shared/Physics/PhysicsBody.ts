/*
  Part of Kosmud

  Rigid body.
*/

import { validateNumber, validateVector } from "../../Shared/Utils/Math";
// import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
import { Physics } from "../../Shared/Physics/Physics";
import { Vector } from "../../Shared/Physics/Vector";

// 3rd party modules.
import { b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType,
  b2FixtureDef, b2Shape, b2ShapeType } from "../../Shared/Box2D/Box2D";

export class PhysicsBody
{
  private velocity = 0;
  private readonly body: b2Body;

  constructor(world: b2World, config: PhysicsBody.Config)
  {
    const bodyDefinition = new b2BodyDef();
    const x = (config.position !== undefined) ? config.position.x : 0;
    const y = (config.position !== undefined) ? config.position.y : 0;

    bodyDefinition.position.Set(x, y);
    bodyDefinition.type = b2BodyType.b2_dynamicBody;

    this.body = world.CreateBody(bodyDefinition);

    for (const polygon of config.shape)
    {
      const fixtureDefinition = createFixtureDefinition(polygon, config);

      this.body.CreateFixture(fixtureDefinition);
    }
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
    const shape: Physics.Shape = [];

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

        const polygon: Physics.Polygon = [];

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

function createFixtureDefinition
(
  polygon:
  Physics.Polygon,
  config: PhysicsBody.Config
)
: b2FixtureDef
{
  const friction =
    (config.friction !== undefined) ? config.friction : 0.5;
  const restitution =
    (config.restitution !== undefined) ? config.restitution : 1;

  const shape = new b2PolygonShape();

  shape.Set(polygon);

  const fixtureDefinition = new b2FixtureDef();

  fixtureDefinition.shape = shape;

  // density * area = mass
  fixtureDefinition.density = config.density;
  // 0 - no friction, 1 - maximum friction
  fixtureDefinition.friction = friction;
  // 0 - almost no bouncing, 1 - maximum bouncing.
  fixtureDefinition.restitution = restitution;

  return fixtureDefinition;
}

// ------------------ Type Declarations ----------------------

export namespace PhysicsBody
{
  export interface Config
  {
    position?: { x: number; y: number };  // Default: { x: 0, y: 0 }.
    shape: Physics.Shape;
    density: number;
    friction?: number;                    // Default: 0.5
    // 0 - almost no bouncing, 1 - maximum bouncing.
    restitution?: number;                 // Default: 1.0
  }
}