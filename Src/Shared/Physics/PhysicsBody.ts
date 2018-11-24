/*
  Part of Kosmud

  Rigid body.
*/

import { validateNumber, validateVector } from "../../Shared/Utils/Math";
import { Zone } from "../../Shared/Game/Zone";
import { Physics } from "../../Shared/Physics/Physics";
import { Vector } from "../../Shared/Physics/Vector";
import { Vehicle } from "../../Shared/Physics/Vehicle";

// 3rd party modules.
import { b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType,
  b2FixtureDef, b2Shape, b2ShapeType } from "../../Shared/Box2D/Box2D";

export class PhysicsBody
{
  public shapeId: string | "Not set" = "Not set";
  /// Tohle je sice divně malý číslo, ale když ho zvětším, tak pak musej
  /// bejt mnohem větší všechny thrusty, torques a tak a vektory
  /// jsou pak přes celou obrazovku (mohl bych je teda scalovat, když na to
  /// příjde).
  public density = 0.00001;
  public friction = 0.5;       // Value: 0 to 1.
  // 0 - almost no bouncing, 1 - maximum bouncing.
  public restitution = 1;      // Value: 0 to 1.

  /// TODO: Až budu chtít PhysicsBody savovat, tak musím tohle pořešit.
  ///   Property 'initialPosition' se totiž používá jen při vkládání
  /// do physics worldu - getPosition() potom vytahuje pozici s physicsBody.
  ///   Možná to bude chtít custom savování/loadování, protože při savu
  /// je potřeba nejdřív vytáhnout aktuální pozici z this.body a pak až ji
  /// savnout. A při loadu se pak zas musí body vytvořit.
  public readonly initialPosition = { x: 0, y: 0 };

  // private readonly velocity = 0;
  /// TODO: Tohle by se nemělo savovat (až budu řešit savování).
  private body: b2Body | "Doesn't exist" = "Doesn't exist";

  // ! Throws exception on error.
  constructor
  (
    /// TODO: Tohle nesavovat.
    private readonly vehicle: Vehicle
  )
  {
  }

  public getPosition()
  {
    return validateVector(this.getBody().GetPosition());
  }

  public getX()
  {
    return validateNumber(this.getBody().GetPosition().x);
  }

  public getY()
  {
    return validateNumber(this.getBody().GetPosition().y);
  }

  public getRotation()
  {
    return validateNumber(this.getBody().GetAngle());
  }

  public getAngularVelocity()
  {
    return validateNumber(this.getBody().GetAngularVelocity());
  }

  // Inertia is resistance to torque.
  public getInertia()
  {
    return validateNumber(this.getBody().GetInertia());
  }

  // Mass is resistance to linear force.
  public getMass()
  {
    return validateNumber(this.getBody().GetMass());
  }

  // public setVelocity(velocity: number)
  // {
  //   this.velocity = validateNumber(velocity);

  //   this.updateVelocityDirection();
  // }

  public setAngularVelocity(angularVelocity: number)
  {
    this.getBody().SetAngularVelocity(validateNumber(angularVelocity));
  }

  public applyForce(force: Vector)
  {
    this.getBody().ApplyForceToCenter(validateVector(force));
  }

  public applyTorque(torque: number)
  {
    this.getBody().ApplyTorque(validateNumber(torque));
  }

  public getVelocity(): Vector
  {
    return validateVector(this.getBody().GetLinearVelocity());
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

  // public updateVelocityDirection()
  // {
  //   this.getBody().SetLinearVelocity(this.getVelocity());
  // }

  public getShape()
  {
    const shape: Physics.Shape = [];

    for
    (
      let fixture = this.getBody().GetFixtureList();
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

  // ! Throws exception on error.
  public create(world: b2World, zone: Zone)
  {
    if (this.body !== "Doesn't exist")
    {
      throw new Error(`Vehicle ${this.vehicle.debugId}`
        + ` is already added to a physics world`);
    }

    if (this.shapeId === "Not set")
    {
      throw new Error(`Failed to create physics body of vehicle`
        + ` '${this.vehicle.debugId}' because it doesn't have a`
        + ` 'shapeId'. Make sure you set 'shapeId' before you add`
        + ` the vehicle to physics world`);
    }

    const shape = zone.getPhysicsShape(this.shapeId);

    // ! Throws exception on error.
    this.createBody(world, shape);
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private getBody()
  {
    if (this.body === "Doesn't exist")
    {
      throw new Error(`Vehicle ${this.vehicle.debugId} isn't`
        + ` added to a physics world yet`);
    }

    return this.body;
  }

  private createBody(world: b2World, shape: Physics.Shape)
  {
    const bodyDefinition = new b2BodyDef();

    bodyDefinition.position.Set
    (
      this.initialPosition.x,
      this.initialPosition.y
    );
    bodyDefinition.type = b2BodyType.b2_dynamicBody;

    this.body = world.CreateBody(bodyDefinition);

    this.createFixtures(this.body, shape);
  }

  private createFixtures(body: b2Body, shape: Physics.Shape)
  {
    for (const polygon of shape)
    {
      const fixtureDefinition = this.createFixtureDefinition(polygon);

      body.CreateFixture(fixtureDefinition);
    }
  }

  private createFixtureDefinition(polygon: Physics.Polygon): b2FixtureDef
  {
    const shape = new b2PolygonShape();

    shape.Set(polygon);

    const fixtureDefinition = new b2FixtureDef();

    fixtureDefinition.shape = shape;

    // density * area = mass
    fixtureDefinition.density = this.density;
    // 0 - no friction, 1 - maximum friction
    fixtureDefinition.friction = this.friction;
    // 0 - almost no bouncing, 1 - maximum bouncing.
    fixtureDefinition.restitution = this.restitution;

    return fixtureDefinition;
  }
}