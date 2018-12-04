/*
  Part of Kosmud

  Rigid body.
*/

import { Physics } from "../../Shared/Physics/Physics";
import { Vector } from "../../Shared/Physics/Vector";
import { Entity } from "../../Shared/Class/Entity";

// 3rd party modules.
import { b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType,
  b2FixtureDef, b2Shape, b2ShapeType } from "../../Shared/Box2D/Box2D";
import { VehiclePhysics } from "./VehiclePhysics";

export class PhysicsBody
{
  private readonly box2dBody: b2Body;

  // ! Throws exception on error.
  constructor
  (
    /// TODO: Tohle nesavovat.
    private readonly entity: Entity,
    box2dWorld: b2World,
    entityPhysics: VehiclePhysics,
    physicsShape: Physics.Shape
  )
  {
    this.box2dBody = createBody(box2dWorld, physicsShape, entityPhysics);
  }

  // ! Throws exception on error.
  public getPosition()
  {
    // ! Throws exception on error.
    return new Vector(this.box2dBody.GetPosition()).validate();
  }

  // ! Throws exception on error.
  public getX()
  {
    // ! Throws exception on error.
    return Number(this.box2dBody.GetPosition().x).validate();
  }

  // ! Throws exception on error.
  public getY()
  {
    // ! Throws exception on error.
    return Number(this.box2dBody.GetPosition().y).validate();
  }

  // ! Throws exception on error.
  public getRotation()
  {
    // ! Throws exception on error.
    return Number(this.box2dBody.GetAngle()).validate();
  }

  // ! Throws exception on error.
  public getAngularVelocity()
  {
    // ! Throws exception on error.
    return Number(this.box2dBody.GetAngularVelocity()).validate();
  }

  // ! Throws exception on error.
  // Inertia is resistance to torque.
  public getInertia()
  {
    // ! Throws exception on error.
    return Number(this.box2dBody.GetInertia()).validate();
  }

  // ! Throws exception on error.
  // Mass is resistance to linear force.
  public getMass()
  {
    // ! Throws exception on error.
    return Number(this.box2dBody.GetMass()).validate();
  }

  // ! Throws exception on error.
  public setAngularVelocity(angularVelocity: number)
  {
    // ! Throws exception on error.
    this.box2dBody.SetAngularVelocity(Number(angularVelocity).validate());
  }

  // ! Throws exception on error.
  public applyForce(force: Vector)
  {
    // ! Throws exception on error.
    this.box2dBody.ApplyForceToCenter(Vector.validate(force));
  }

  public getForce()
  {
    return this.box2dBody.m_force;
  }

  // ! Throws exception on error.
  public applyTorque(torque: number)
  {
    // ! Throws exception on error.
    this.box2dBody.ApplyTorque(Number(torque).validate());
  }

  // This should only be used on the client. Only forces should be
  // set to physics body on the server.
  public setVelocity(velocity: Vector)
  {
    // ! Throws exception on error.
    this.box2dBody.SetLinearVelocity(velocity.validate());
  }

  // ! Throws exception on error.
  public getVelocity(): Vector
  {
    // ! Throws exception on error.
    return new Vector(this.box2dBody.GetLinearVelocity()).validate();
  }

  // ! Throws exception on error.
  public getShape()
  {
    const shape: Physics.Shape = [];

    for
    (
      let fixture = this.box2dBody.GetFixtureList();
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
              // ! Throws exception on error.
              x: Number(vertex.x).validate(),
              // ! Throws exception on error.
              y: Number(vertex.y).validate()
            }
          );
        }

        shape.push(polygon);
      }
    }

    return shape;
  }
}

// ----------------- Auxiliary Functions ---------------------

function createBody
(
  box2dWorld: b2World,
  physicsShape: Physics.Shape,
  entityPhysics: VehiclePhysics
)
{
  const bodyDefinition = new b2BodyDef();

  bodyDefinition.position.Set
  (
    entityPhysics.initialPosition.x,
    entityPhysics.initialPosition.y
  );
  bodyDefinition.angle = entityPhysics.initialRotation;
  bodyDefinition.type = b2BodyType.b2_dynamicBody;

  const box2dBody = box2dWorld.CreateBody(bodyDefinition);

  createFixtures(box2dBody, physicsShape, entityPhysics);

  return box2dBody;
}

function createFixtures
(
  box2dBody: b2Body,
  shape: Physics.Shape,
  entityPhysics: VehiclePhysics
)
{
  for (const polygon of shape)
  {
    const fixtureDefinition = createFixtureDefinition
    (
      polygon, entityPhysics
    );

    box2dBody.CreateFixture(fixtureDefinition);
  }
}

function createFixtureDefinition
(
  polygon: Physics.Polygon,
  entityPhysics: VehiclePhysics
)
: b2FixtureDef
{
  const shape = new b2PolygonShape();

  shape.Set(polygon);

  const fixtureDefinition = new b2FixtureDef();

  fixtureDefinition.shape = shape;

  // density * area = mass
  fixtureDefinition.density = entityPhysics.density;
  // 0 - no friction, 1 - maximum friction
  fixtureDefinition.friction = entityPhysics.friction;
  // 0 - almost no bouncing, 1 - maximum bouncing.
  fixtureDefinition.restitution = entityPhysics.restitution;

  return fixtureDefinition;
}