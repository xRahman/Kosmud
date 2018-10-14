/*
  Part of Kosmud

  Physics World.
*/

import {PhysicsBody} from '../../Shared/Physics/PhysicsBody';

import
{
  b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType, b2FixtureDef
}
from '../../Shared/Box2D/Box2D';

/// Test.
const GRAVITY = new b2Vec2(0, 0);

export class PhysicsWorld
{
  private world = new b2World(GRAVITY);

  public createBody(): PhysicsBody
  {
    const bodyDefinition = new b2BodyDef();

    bodyDefinition.position.Set(0, 0);
    bodyDefinition.type = b2BodyType.b2_dynamicBody;

    let body = this.world.CreateBody(bodyDefinition);

    let shape = new b2PolygonShape();

    /// Zatím natvrdo.
    shape.SetAsBox(250, 250);

    const fixtureDefinition = new b2FixtureDef();

    fixtureDefinition.shape = shape;
    // density * area = mass
    fixtureDefinition.density = 1; 
    // 0 - no friction, 1 - maximum friction
    fixtureDefinition.friction = 0.5;
    // 0 - almost no bouncing, 1 - maximum bouncing.
    fixtureDefinition.restitution = 1;

    body.CreateFixture(fixtureDefinition);


    return new PhysicsBody(body);
  }

  public tick(miliseconds: number)
  {
    this.world.Step(miliseconds / 1000, 6, 2);
  }
}