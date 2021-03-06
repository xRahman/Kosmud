/*
  Part of Kosmud

  Wraps Box2d rigid body.
*/

import { Physics } from "../../Shared/Physics/Physics";
import { Vector } from "../../Shared/Physics/Vector";
// import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
import { Entity } from "../../Shared/Class/Entity";

// 3rd party modules.
import { b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType,
  b2FixtureDef, b2ShapeType, b2MassData } from "../../Shared/Box2D/Box2D";
import { EntityPhysics } from "../../Shared/Physics/EntityPhysics";
import { PositiveNumber } from "../Utils/PositiveNumber";
import { ZeroTo2Pi } from "../Utils/ZeroTo2Pi";

export class PhysicsBody
{
  private readonly box2dBody: b2Body;

  constructor
  (
    private readonly entity: Entity,
    box2dWorld: b2World,
    entityPhysics: EntityPhysics,
    physicsShape: Physics.Shape
  )
  {
    this.box2dBody = createBody(box2dWorld, physicsShape, entityPhysics);

    // Set center of mass regardless to where box2d computed it.
    // This causes sprites to always rotate around their origin
    // regardless of actual mass distribution.
    this.setCenterOfMass({ x: 0, y: 0 });
  }

  // ! Throws exception on error.
  public getPosition()
  {
    // ! Throws exception on error.
    return new Vector(this.box2dBody.GetPosition()).validate();
  }

  public setPosition(position: { x: number; y: number })
  {
    this.box2dBody.SetPosition(position);
  }

  // ! Throws exception on error.
  public getX()
  {
    // ! Throws exception on error.
    return this.box2dBody.GetPosition().x.validate();
  }

  // ! Throws exception on error.
  public getY()
  {
    // ! Throws exception on error.
    return this.box2dBody.GetPosition().y.validate();
  }

  // ! Throws exception on error.
  public getRotation()
  {
    // ! Throws exception on error.
    const rotation = this.box2dBody.GetAngle().validate();

    return new ZeroTo2Pi(rotation);
  }

  // ! Throws exception on error.
  public setRotation(rotation: ZeroTo2Pi)
  {
    this.box2dBody.SetAngle(rotation.valueOf());
  }

  // ! Throws exception on error.
  public getAngularVelocity()
  {
    // ! Throws exception on error.
    return this.box2dBody.GetAngularVelocity().validate();
  }

  // ! Throws exception on error.
  public getInertia()
  {
    // ! Throws exception on error.
    const inertia = this.box2dBody.GetInertia().validate();

    // ! Throws exception on error.
    return new PositiveNumber(inertia);
  }

  // ! Throws exception on error.
  // Mass is resistance to linear force.
  public getMass()
  {
    // ! Throws exception on error.
    const mass = this.box2dBody.GetMass().validate();

    // ! Throws exception on error.
    return new PositiveNumber(mass);
  }

  public getCenterOfMass()
  {
    return new Vector(this.box2dBody.GetLocalCenter()).validate();
  }

  public setCenterOfMass({ x, y }: { x: number; y: number })
  {
    const massData = new b2MassData();

    this.box2dBody.GetMassData(massData);

    massData.center.Set(x, y);

    this.box2dBody.SetMassData(massData);
  }

  // ! Throws exception on error.
  public setAngularVelocity(angularVelocity: number)
  {
    // ! Throws exception on error.
    this.box2dBody.SetAngularVelocity(angularVelocity.validate());
  }

  // ! Throws exception on error.
  public applyForce(force: Vector)
  {
    // ! Throws exception on error.
    this.box2dBody.ApplyForceToCenter(force.validate());
  }

  // ! Throws exception on error.
  public applyImpulse(impulse: Vector)
  {
    // ! Throws exception on error.
    this.box2dBody.ApplyLinearImpulseToCenter(impulse.validate());
  }

  // ! Throws exception on error.
  public applyTorque(torque: number)
  {
    // ! Throws exception on error.
    this.box2dBody.ApplyTorque(torque.validate());
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
              x: vertex.x.validate(),
              // ! Throws exception on error.
              y: vertex.y.validate()
            }
          );
        }

        shape.push(polygon);
      }
    }

    return shape;
  }

  public getLinearDumping()
  {
    return this.box2dBody.GetLinearDamping();
  }
}

// ----------------- Auxiliary Functions ---------------------

function createBody
(
  box2dWorld: b2World,
  physicsShape: Physics.Shape,
  entityPhysics: EntityPhysics
)
{
  const bodyDefinition = new b2BodyDef();

  bodyDefinition.position.Set
  (
    entityPhysics.getX(),
    entityPhysics.getY()
  );
  bodyDefinition.angle = entityPhysics.getRotation().valueOf();
  bodyDefinition.type = b2BodyType.b2_dynamicBody;

  const box2dBody = box2dWorld.CreateBody(bodyDefinition);

  createFixtures(box2dBody, physicsShape, entityPhysics);

  return box2dBody;
}

function createFixtures
(
  box2dBody: b2Body,
  shape: Physics.Shape,
  entityPhysics: EntityPhysics
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
  entityPhysics: EntityPhysics
)
: b2FixtureDef
{
  const shape = new b2PolygonShape();

  shape.Set(polygon);

  const fixtureDefinition = new b2FixtureDef();

  fixtureDefinition.shape = shape;

  // density * area = mass
  fixtureDefinition.density = entityPhysics.DENSITY.valueOf();
  // 0 - no friction, 1 - maximum friction
  fixtureDefinition.friction = entityPhysics.FRICTION.valueOf();
  // 0 - almost no bouncing, 1 - maximum bouncing.
  fixtureDefinition.restitution = entityPhysics.RESTITUTION.valueOf();

  return fixtureDefinition;
}